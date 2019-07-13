'use strict'

const monitoring = require('./monitor.js');
const express = require('express');

monitoring.startMonitoring(30);

const app = express();

app.use(express.static(__dirname + '/App'));

app.get('/api/getTemperatures', (req, res) => {
  res.json(monitoring.getLast5Temperatures())
})

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/App/index.html');
});

app.listen(3000, () => {
  console.log('App is listening on port 3000')
});
