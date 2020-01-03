// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// your app's Firebase project configuration
const firebaseConfig = require('./config')

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;