require("dotenv").config();
const express = require("express");
const router = express.Router();
const Guard = require("../models/Guard");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const {
  createGuard,
  getGuards,
  updateGuard,
  replaceDocument,
  clearGuardReviews,
  shareFullAssignmentToClient,
  shareGuardDetailsWithClient,
  submitFeedback,
  deleteGuard,
  getUnreadReviewsCount,
  markAllReviewsAsRead,
} = require("../controllers/guardController");

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
    key: (req, file, cb) => {
      cb(null, `documents/${Date.now()}-${file.originalname}`);
    },
  }),
});

router.post("/", createGuard);
router.get("/", getGuards);

// ✅ IMPORTANT: Specific routes must come BEFORE parameterized routes
router.get("/unread-reviews-count", getUnreadReviewsCount);
router.put("/mark-reviews-read", markAllReviewsAsRead);
router.post("/share-full-assignment", shareFullAssignmentToClient);
router.post("/submit-feedback", submitFeedback);

// ✅ Parameterized routes come AFTER specific routes
router.put("/:id", updateGuard);
router.delete("/:id", deleteGuard);
router.post("/:id/replace-document", upload.single("file"), replaceDocument);
router.delete("/clear-reviews/:id", clearGuardReviews);


router.post("/upload-other/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const fileUrl = req.file.location;
    const fileName = req.file.originalname;

    const guard = await Guard.findById(id);
    guard.otherDocuments.push({ name: fileName, url: fileUrl });
    await guard.save();

    res.status(200).json({ message: "Document uploaded", url: fileUrl, name: fileName });
  } catch (error) {
    console.error("Error uploading other document:", error);
    res.status(500).json({ message: "Failed to upload document" });
  }
});

module.exports = router;

