const router = require('express').Router();
const firebase = require('../firebase')
const firestore = require('../firebase/firestore')

const isEmpty = strValue => {
  if (!strValue) return true
  return strValue.trim() === '' ? true : false
}

const isEmail = email => {
  if (!email) return false;
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

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors)
  }
  // validation--

  let token = null;
  let userId = null;
  let user = null;

  firestore.collection('users').where('nickname', '==', nickname).get()
    .then(doc => {
      if (!doc.empty) {
        return res.status(400).json({ nickname: 'The nickname is already in use' })
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
      user = {
        firstName,
        lastName,
        email,
        nickname,
        isAdmin: false,
        createdAt: new Date().toISOString()
      }
      return firestore.collection('users').doc(userId).set(user);
    })
    .then(() => {
      return res.status(201).json({ user, token })
    })
    .catch(function (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({
          email: 'The email address is already in use'
        })
      }
      else if(err.code === 'auth/weak-password') {
        return res.status(400).json({
          password: 'Password should be at least 6 characters'
        })
      }
      else {
        return res.status(500).json({
          general: err.message
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

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors)
  }
  // validation--

  let userId = null;
  let token = null;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken
      return firestore.collection('users').doc(userId).get()
    })
    .then(doc => {
      const user = doc.data()
      return res.json({ user, token })
    })
    .catch(function (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(401).json({
          password: 'The password is invalid.'
        })
      }
      else if(err.code === 'auth/user-not-found') {
        return res.status(401).json({
          email: 'This email is not registered.'
        })
      }
      else {
        return res.status(500).json({
          code: err.code,
          general: err.message
        })
      }
    });
});

module.exports = router;