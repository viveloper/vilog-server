const router = require('express').Router();
const firebase = require('../firebase')
const firestore = require('../firebase/firestore')

router.post('/signup', (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result => {
      // firestore
      const user = { firstName, lastName, email, password }
      const docRef = firestore.collection('users').doc();
      docRef.set(user)
        .then(() => result.user.getIdToken())
        .then(token => res.json({ token }))
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      res.status(400).json({
        code: errorCode,
        message: errorMessage
      })
    });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => result.user.getIdToken())
    .then(token => {
      res.json({
        email,
        token
      })
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      res.json({
        code: errorCode,
        message: errorMessage
      })
    });
});

module.exports = router;