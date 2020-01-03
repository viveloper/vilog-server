const express = require('express');
const cors = require('cors');
const bearerTokenParser = require('express-bearer-token');
const verifyToken = require('./firebase/verifyToken');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bearerTokenParser());

// apply verifyToken middleware
app.use('/api', verifyToken);

// router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const sectionRouter = require('./routes/api/sections');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/sections', sectionRouter);
app.use(function(err, req, res, next) {
  res.status(err.statusCode).json(err);
});

// run server
const port = 5000;
app.listen(port, () => {
  console.log(`running vilog server at port : ${port}`);
});