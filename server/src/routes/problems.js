const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/problems - List all problems with optional query filters
router.get('/', async (req, res) => {
  try {
    const { category, status, search, state } = req.query;
    const problems = await db.getProblems({ category, status, search, state });
    res.json({ success: true, count: problems.length, data: problems });
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/problems/:id - Get single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await db.getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }
    res.json({ success: true, data: problem });
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/problems - Submit a new problem
router.post('/', async (req, res) => {
  try {
    const { title, description, category, hashtags, state, district, imageUrl, videoUrl } = req.body;
    
    if (!title || !description || !category || !state || !district) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, description, category, state, and district are mandatory."
      });
    }

    const created = await db.createProblem({
      title,
      description,
      category,
      hashtags: hashtags || "",
      state,
      district,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Error creating problem:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/problems/:id/upvote - Upvote a problem
router.post('/:id/upvote', async (req, res) => {
  try {
    const updated = await db.upvoteProblem(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error upvoting problem:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/problems/:id/status - Demo control to change problem status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" });
    }
    const updated = await db.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
