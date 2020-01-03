const router = require('express').Router();
const firebase = require('../firebase')
const firestore = require('../firebase/firestore')

const isEmpty = strValue => {
  return strValue.trim() === '' ? true : false
}

const isEmail = email => {
  const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
  return email.match(regEx) ? true : false;
}

router.post('/signup', (req, res, next) => {
  const { firstName, lastName, email, nickname, password, confirmPassword } = req.body;

  // validation
  const errors = {};

  if (isEmpty(email)) errors.email = 'Must not be empty.'
  else if (!isEmail(email)) errors.email = 'Must be a valid email address.'

  if (isEmpty(password)) errors.password = 'Must not be empty.'
  if (isEmpty(confirmPassword)) errors.confirmPassword = 'Must not be empty.'
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match.'

  if (isEmpty(nickname)) errors.nickname = 'Must not be empty.'
  if (isEmpty(firstName)) errors.firstName = 'Must not be empty.'
  if (isEmpty(lastName)) errors.lastName = 'Must not be empty.'

  if(Object.keys(errors).length > 0) {
    return res.status(400).json(errors)
  }
  // validation--

  let token = null;
  let userId = null;

  firestore.collection('users').doc(nickname).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ nickname: 'The nickname is already in use by another account.' })
      }
      else {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      return firestore.collection('users').doc(nickname).set({
        userId,
        firstName,
        lastName,
        email,
        nickname,
        isAdmin: false,
        createdAt: new Date().toISOString()
      })
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(function (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({
          email: 'The email address is already in use by another account.'
        })
      }
      else {
        return res.status(500).json({
          errorCode: err.code,
          errorMessage: err.message
        })
      }
    });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // validation
  const errors = {};

  if (isEmpty(email)) errors.email = 'Must not be empty.'
  else if (!isEmail(email)) errors.email = 'Must be a valid email address.'

  if (isEmpty(password)) errors.password = 'Must not be empty.'  

  if(Object.keys(errors).length > 0) {
    return res.status(400).json(errors)
  }
  // validation--

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(function (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(401).json({
          password: 'The password is invalid or the user does not have a password.'
        })
      }
      else {
        return res.status(500).json({
          errorCode: err.code,
          errorMessage: err.message
        })
      }      
    });
});

module.exports = router;