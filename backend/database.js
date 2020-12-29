const mariadb = require('mariadb');
const config = require('./config');

let dbConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: 5,
};

// const pool = mariadb.createPool(dbConfig);

/*
 add support for socketPath, if socketPath is in conf, use that instead of hostname
 */

const getDatabaseConnection = () => {
  console.log('getDatabaseConnection', `jdbc:mariadb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  return pool.getConnection();
};

exports.getDatabaseConnection = getDatabaseConnection;
