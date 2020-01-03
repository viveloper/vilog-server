const admin = require('./admin')

const verifyToken = (req, res, next) => {
  const token = req.token;
  if (!token) {
    const error = new Error();
    error.statusCode = 401;
    error.message = 'missing token';
    return next(error);
  }

  // idToken comes from the client app
  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      }
      return next();
    })
    .catch(function (error) {
      // Handle error
      error.statusCode = 401;
      return next(error);
    });
}

module.exports = verifyToken;