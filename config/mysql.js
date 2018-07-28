const config = require('./config');
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

conn.connect();

module.exports = conn;