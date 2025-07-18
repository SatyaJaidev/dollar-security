const express = require('express');
const router = express.Router();
const { getVisitorStats } = require('../config/analytics');

router.get('/visitors', async (req, res) => {
  const visitors = await getVisitorStats();
  if (!visitors) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
  res.json({ visitors });
});

module.exports = router;
