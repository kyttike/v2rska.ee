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

let DBConn;
database.getDatabaseConnection()
  .then(conn => {
    DBConn = conn;
    return conn.query('SELECT * FROM temperature ' +
      'WHERE datetime > (NOW() - INTERVAL 1 YEAR) AND location = \'katel\' LIMIT 10;');
  })
  .then(rows => {
    console.log('rows type', typeof rows);
    rows.map(e => console.log(e))
    console.log(rows)
  })
  .catch(err => console.warn(2, err))
  .then(() => {
    if (DBConn) DBConn.end();
  });

module.exports = router;

