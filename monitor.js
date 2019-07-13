const axios = require('axios');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const config = require('./config');

let last5Temperatures = [];

const deviceAddress = config.monitoringURL;

const startMonitoring = (durationInSeconds = 60) => {
  getTemperatureData();
  setInterval(() => getTemperatureData(), durationInSeconds * 1000);
};

const getTemperatureData = () => {
  return axios.get(deviceAddress)
    .then(response => {
      const parsedXml = xmlReader.parseSync(response.data);
      currentTemp = xmlQuery(parsedXml).find('Temperature1').text().split('&#176;')[0];
      last5Temperatures.push(currentTemp);
      if (last5Temperatures.length > 5) {
        last5Temperatures = last5Temperatures.slice(1);
      }
    });
};

const getLast5Temperatures = () => {
  return last5Temperatures;
};

exports.startMonitoring = startMonitoring;
exports.getLast5Temperatures = getLast5Temperatures;
