'use strict';

const monitoring = require('./monitor');
const express = require('express');
const api = require('./api');

monitoring.startMonitoring(30);

const app = express();
app.use(express.static(__dirname + '/App'));
app.use('/api', api);
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/App/index.html');
});

app.listen(3000, () => {
  console.log('App is listening on port 3000')
});
