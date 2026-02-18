const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const document = await Document.create({
      owner: req.user.userId,   
      originalName: req.file.originalname,
      filePath: req.file.path,
      status: "uploaded"
    });

    res.json({
      message: "PDF uploaded successfully",
      fileUrl,
      documentId: document._id   
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
