'use strict';

const monitoring = require('./monitor');
const express = require('express');
const api = require('./api');
const config = require('./config');

monitoring.startMonitoring(config.monitoringFrequency);

const app = express();
app.use(express.static(__dirname + '/App'));
app.use('/api', api);
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/App/index.html');
});
console.log(config);

const port = config.serverPort;
app.listen(port, () => {
  console.log('App is listening on port ' + port)
});
