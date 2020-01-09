const router = require('express').Router();
const inspect = require('util').inspect;
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

router.post('/', (req, res, next) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join(os.tmpdir(), path.basename(fieldname));
    saveTo = `/Users/viveloper/Downloads/${fieldname}`;
    console.log(saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function () {
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  });
  return req.pipe(busboy);
});

module.exports = router;