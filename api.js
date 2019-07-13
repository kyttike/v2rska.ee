const express = require('express');
const monitoring = require('./monitor');
const router = express.Router();

router.get('/temperature', (req, res) => {
  const temperatures = monitoring.getRealtimeTemperatures();
  res.send({
    temperature: temperatures.length ? temperatures[temperatures.length - 1] : null,
  })
});

router.get('/temperatures', (req, res) => {
  res.send({
    last5Temperatures: monitoring.getRealtimeTemperatures(),
  })
});

module.exports = router;

