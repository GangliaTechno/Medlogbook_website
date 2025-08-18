const express = require('express');
const multer = require("multer");
const path = require("path");
const LogEntry = require("../models/LogEntry");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
const logbookController = require('../controllers/logentryController');

// POST /add - Add new log entry with validation, JSON parsing, and file handling
router.post("/add", upload.any(), async (req, res) => {
  try {
    const { email, categoryId, categoryName, data } = req.body;

    // Validate required fields
    if (!email || !categoryId || !categoryName || !data) {
      return res.status(400).json({
        error: "Missing required field(s): email, categoryId, categoryName, or data"
      });
    }

    // Parse data JSON safely
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return res.status(400).json({ error: "Failed to parse 'data' as JSON." });
    }

    // Collect uploaded files with metadata
    const files = req.files?.map(file => ({
      fieldName: file.fieldname,
      buffer: file.buffer,
      originalName: file.originalname,
      title: req.body[`${file.fieldname}_title`] || "",
      name: req.body[`${file.fieldname}_name`] || "",
      type: req.body[`${file.fieldname}_type`] || "",
      description: req.body[`${file.fieldname}_description`] || ""
    })) || [];

    // Create new log entry document
    const log = new LogEntry({
      email,
      categoryId,
      categoryName,
      data: parsedData,
      files
    });

    await log.save();
    res.status(201).json({ message: "Log entry saved" });
  } catch (err) {
    console.error("Error saving log entry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Other existing routes
router.get('/:email', logbookController.getEntries);
router.put('/update', logbookController.updateEntry);
router.get('/review-status/:email', logbookController.getEntriesByReviewStatus);
router.get("/average-score/:email", logbookController.getAverageScore);

module.exports = router;
