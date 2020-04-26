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

/*
database.getDatabaseConnection()
  .then(conn => {
    return conn.query('SELECT * FROM temperature ' +
      'WHERE datetime > (NOW() - INTERVAL 1 DAY) AND location = \'katel\';')
      .then(rows => {
        for (let i in rows) {
          console.log(rows[i], 'END OF ROW')
        }
        console.log('END OF DATA');
      })
      .catch(err => console.warn(err))
      .then(() => conn.end());
  })
  .catch(err => console.warn(err));
*/

module.exports = router;

