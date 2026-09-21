const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

// POST /api/problems/:id/info - Add contextual community information to a problem
router.post('/:id/info', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "Information content cannot be empty." });
    }

    const info = await db.addProblemInfo(req.params.id, content);
    if (!info) {
      return res.status(404).json({ success: false, error: "Problem not found." });
    }

    res.status(201).json({ success: true, data: info });
  } catch (err) {
    console.error("Error adding problem info:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
