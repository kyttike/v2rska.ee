const express = require('express');
const monitoring = require('./monitor');
const router = express.Router();
const database = require('./database');

router.get('/temperature', (req, res) => {
  const temperatures = monitoring.getRealtimeTemperatures();
  res.send(temperatures.length ? temperatures[temperatures.length - 1] : null);
});

router.get('/temperatures', (req, res) => {
  res.send({
    temperatures: monitoring.getRealtimeTemperatures(),
  })
});

module.exports = router;

