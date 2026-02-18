const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const fs = require("fs");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/sign", require("./routes/signRoutes"));
app.use("/api/pdf", require("./routes/pdfRoutes"));

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
