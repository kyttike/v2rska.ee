//rename to config.js

const config = {
  serverPort: 3000,
  monitoringURL: 'http://IPADDRESS:PORT/status.xml',
  monitoringFrequencyInSeconds: 60,
  database: {
    host: 'HOSTNAME',
    port: 3307,
    username: 'USERNAME',
    password: 'PASSWORD',
    database: 'monitoring',
  },
  databaseWritingFrequency: 10,
};

module.exports = config;
