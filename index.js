const express = require('express');
const axios = require('axios');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const app = express();

let currentTemp = 1337;
let last5Temperatures = [];
app.get('/', (req, res) => res.send(last5Temperatures));
let counter = 0;

const apiCall = function() {
    return axios.get('http://192.168.3.117:8100/status.xml')
        .then(response => {
            const parsedXml = xmlReader.parseSync(response.data);
            currentTemp = xmlQuery(parsedXml).find('Temperature1').text().split('&#176;')[0];
            last5Temperatures.push(currentTemp);
            if (last5Temperatures.length > 5) {
                last5Temperatures = last5Temperatures.slice(1);
            }
            console.log(currentTemp, last5Temperatures);
        });
};

setInterval(() => apiCall(), 30 * 1000);
apiCall()
    .then(() => app.listen(3000, () => {}));