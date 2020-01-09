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
const sectionsRouter = require('./routes/api/sections');
const postsRouter = require('./routes/api/posts');
const uploadRouter = require('./routes/api/upload');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/upload', uploadRouter);
app.use(function(err, req, res, next) {
  res.status(err.statusCode).json(err);
});

// run server
const port = 5000;
app.listen(port, () => {
  console.log(`running vilog server at port : ${port}`);
});