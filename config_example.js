//rename to config.js

const config = {
  serverPort: 3000,
  monitoringURL: 'http://IPADDRESS:PORT/status.xml',
  monitoringFrequency: 60,
  database: {
    host: 'HOSTNAME',
    username: 'USERNAME',
    password: 'PASSWORD',
    database: 'monitoring',
  },
};

module.exports = config;
