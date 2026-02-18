const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    signedFilePath: {
      type: String
    },
    status: {
      type: String,
      enum: ["uploaded", "signed"],
      default: "uploaded"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
