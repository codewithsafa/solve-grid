const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');

// POST /api/problems/:id/discussions - Add a discussion comment to a problem
router.post('/:id/discussions', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "Discussion content cannot be empty." });
    }

    const discussion = await db.addDiscussion(req.params.id, content);
    if (!discussion) {
      return res.status(404).json({ success: false, error: "Problem not found." });
    }

    res.status(201).json({ success: true, data: discussion });
  } catch (err) {
    console.error("Error posting discussion:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
