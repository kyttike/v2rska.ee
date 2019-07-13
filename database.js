const mariadb = require('mariadb');
const config = require('./config');

const pool = mariadb.createPool({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: 5,
});

const getDatabaseConnection = () => {
  return pool.getConnection();
};

exports.getDatabaseConnection = getDatabaseConnection;
