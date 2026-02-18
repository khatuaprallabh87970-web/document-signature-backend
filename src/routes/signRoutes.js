const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const authMiddleware = require("../middleware/authMiddleware");
const Document = require("../models/Document");

const router = express.Router();

router.post("/:id/sign", authMiddleware, async (req, res) => {
  try {
    const { signature } = req.body;

    if (!signature) {
  return res.status(400).json({ message: "Signature required" });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pdfBytes = fs.readFileSync(document.filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const base64Data = signature.replace(/^data:image\/png;base64,/, "");
const pngBuffer = Buffer.from(base64Data, "base64");

const pngImage = await pdfDoc.embedPng(pngBuffer);

firstPage.drawImage(pngImage, {
  x: 100,
  y: 100,
  width: 150,
  height: 80,
});

    const signedPdfBytes = await pdfDoc.save();

    const signedPath = path.join(
      "uploads",
      `signed-${Date.now()}.pdf`
    );

    fs.writeFileSync(signedPath, signedPdfBytes);

    document.signedFilePath = signedPath;
    document.status = "signed";
    await document.save();

    res.json({
      message: "Document signed successfully",
      signedPdfUrl: `http://localhost:5000/uploads/${path.basename(signedPath)}`
    });
  } catch (error) {
    res.status(500).json({ message: "Signing failed" });
  }
});

module.exports = router;
