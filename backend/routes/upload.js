
const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `documents/${Date.now()}-${file.originalname}`);
    },
  }),
});

router.post("/upload", upload.single("document"), (req, res) => {
  try {
    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: req.file.location,
    });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed", details: err });
  }
});

module.exports = router;


