const express = require("express");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const Document = require("../models/Document");

const router = express.Router();

// Upload PDF
router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    try {
      const doc = await Document.create({
        owner: req.user.userId,
        originalName: req.file.originalname,
        filePath: req.file.path
      });

      res.status(201).json(doc);
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// Get my documents
router.get("/", authMiddleware, async (req, res) => {
  const docs = await Document.find({ owner: req.user.userId });
  res.json(docs);
});

module.exports = router;
