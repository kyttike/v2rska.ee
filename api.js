const express = require('express');
const monitoring = require('./monitor');
const router = express.Router();

router.get('/temperature', (req, res) => {
  const temperatures = monitoring.getLast5Temperatures();
  res.json(temperatures.length ? temperatures[temperatures.length - 1] : null)
});

router.get('/temperatures', (req, res) => {
  res.json(monitoring.getLast5Temperatures())
});

module.exports = router;

