const express = require('express');
const monitoring = require('./monitor');
const router = express.Router();

router.get('/temperature', (req, res) => {
  const temperatures = monitoring.getLast5Temperatures();
  res.send({
    temperature: temperatures.length ? temperatures[temperatures.length - 1] : null,
  })
});

router.get('/temperatures', (req, res) => {
  res.send({
    last5Temperatures: monitoring.getLast5Temperatures(),
  })
});

module.exports = router;

