const axios = require('axios');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const config = require('./config');
const database = require('./database');
const moment = require('moment');

let realtimeTemperatures = [];

const deviceAddress = config.monitoringURL;
const totalWithSkips = 12;
const realTimeDataMaxLength = 60;
let counter = totalWithSkips;

const startMonitoring = (durationInSeconds = 60) => {
  getTemperatureData();
  setInterval(() => getTemperatureData(), durationInSeconds * 1000);
};

const getTemperatureData = () => {
  return axios.get(deviceAddress)
    .then(response => {
      const parsedXml = xmlReader.parseSync(response.data);
      const currentTemp = Number(xmlQuery(parsedXml).find('Temperature1').text().split('&#176;')[0]) * 10;
      if (counter >= totalWithSkips) {
        writeTemperatureToDatabase(currentTemp);
        counter = 0;
      }
      realtimeTemperatures.push({
        temperature: currentTemp,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      counter++;
      if (realtimeTemperatures.length > realTimeDataMaxLength) {
        realtimeTemperatures = realtimeTemperatures.slice(1);
      }
    })
    .catch(error => console.warn(error));
};

const writeTemperatureToDatabase = (temperature) => {
  database.getDatabaseConnection()
    .then(conn => {

      return conn.query('INSERT INTO temperature (id, datetime, temperature, location) VALUES (DEFAULT, ?, ?, ?);',
        [moment().format('YYYY-MM-DD HH:mm:ss'), temperature, 'katel'])
        .then(res => console.log(res))
        .catch(error => console.warn(error))
        .then(() => conn.end());
    })
    .catch(error => console.warn(error));
};

const getRealtimeTemperatures = () => {
  return realtimeTemperatures;
};

exports.startMonitoring = startMonitoring;
exports.getRealtimeTemperatures = getRealtimeTemperatures;
