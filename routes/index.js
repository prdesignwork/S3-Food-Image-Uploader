const express = require('express');
const router = express.Router();
const upload  = require('multer')();
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({ accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET });
const s3 = new AWS.S3();

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/image', (req, res, next) => {
  s3.listObjects({Bucket: process.env.S3_BUCKET}, (err, resp) => {
    if (err) {
      next(err)
    } else {
      res.json({resp})
    }
  })
})

router.post('/image', upload.single('image'), (req, res) => {
  let id = uuid();
  console.log(req.file);
  s3.putObject({
    Bucket: process.env.S3_BUCKET,
    Key: id + '.png',
    Body: new Buffer(req.file.buffer),
    ContentType: 'image/png',
    ContentType: 'image/jpg'
  }, err => {
    if (err) {
      next(err)
    } else {
      res.json(`{"success": true}`)
    }
  });
})

module.exports = router;
