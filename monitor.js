const axios = require('axios');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const config = require('./config');
const database = require('./database');
const moment = require('moment');

let realtimeTemperatures = [];

const deviceAddress = config.monitoringURL;
const totalWithSkips = config.databaseWritingFrequency;
const realTimeDataMaxLength = 1440;
let counter = totalWithSkips;

const startMonitoring = (durationInSeconds = 60) => {
  getTemperatureData();
  setInterval(() => getTemperatureData(), durationInSeconds * 1000);
};

const getTemperatureData = () => {
  return axios.get(deviceAddress)
    .then(response => {
      const parsedXml = xmlReader.parseSync(response.data);
      let temp1 = Number(xmlQuery(parsedXml).find('Temperature1').text().split('&#176;')[0]) * 10;
      let temp2 = Number(xmlQuery(parsedXml).find('Temperature2').text().split('&#176;')[0]) * 10;
      temp1 = transformTemperature1(temp1);
      temp2 = transformTemperature2(temp2);

      if (counter >= totalWithSkips) {
        writeTemperatureToDatabase(temp1, 'temp1');
        writeTemperatureToDatabase(temp2, 'temp2');
        counter = 0;
      }
      realtimeTemperatures.push({
        temp1,
        temp2,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      counter++;
      if (realtimeTemperatures.length > realTimeDataMaxLength) {
        realtimeTemperatures = realtimeTemperatures.slice(1);
      }
    })
    .catch(error => console.warn(error));
};

const transformTemperature1 = (oldTemp) => oldTemp - 15;
const transformTemperature2 = (oldTemp) => oldTemp;

const writeTemperatureToDatabase = (temperature, label) => {
  database.getDatabaseConnection()
    .then(conn => {

      return conn.query('INSERT INTO temperature (id, datetime, temperature, location) VALUES (DEFAULT, ?, ?, ?);',
        [moment().format('YYYY-MM-DD HH:mm:ss'), temperature, label])
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
