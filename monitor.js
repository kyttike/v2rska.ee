const axios = require('axios');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const config = require('./config');

let realtimeTemperatures = [];

const deviceAddress = config.monitoringURL;

const startMonitoring = (durationInSeconds = 60) => {
  getTemperatureData();
  setInterval(() => getTemperatureData(), durationInSeconds * 1000);
};

const getTemperatureData = () => {
  return axios.get(deviceAddress)
    .then(response => {
      const parsedXml = xmlReader.parseSync(response.data);
      const currentTemp = Number(xmlQuery(parsedXml).find('Temperature1').text().split('&#176;')[0]) * 10;
      realtimeTemperatures.push(currentTemp);
      if (realtimeTemperatures.length > 5) {
        realtimeTemperatures = realtimeTemperatures.slice(1);
      }
    })
    .catch(error => console.warn(error));
};

const getRealtimeTemperatures = () => {
  return realtimeTemperatures;
};

exports.startMonitoring = startMonitoring;
exports.getRealtimeTemperatures = getRealtimeTemperatures;
