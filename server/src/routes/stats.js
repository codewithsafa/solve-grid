const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dashboard/stats - Returns aggregated metrics for the dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
