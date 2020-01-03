var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://viveloper-blog.firebaseio.com'
});

module.exports = admin;