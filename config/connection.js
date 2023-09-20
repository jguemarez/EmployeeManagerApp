const mysql = require('mysql2');
require('dotenv').config();

const config = {
    host: '127.0.0.1', // IP adress loops back to localhost
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };

const db = mysql.createConnection(
    config,
    console.info(`Connected to the ${config.database} database.`)
  );

module.exports = db;