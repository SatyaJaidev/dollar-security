const express = require("express");
const QuotationQuery = require("../models/QuotationQuery");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const queries = await QuotationQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newQuery = new QuotationQuery(req.body);
    await newQuery.save();
    res.json(newQuery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await QuotationQuery.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
