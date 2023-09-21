//Requiring 'mysql2' in order to make a connection to the database and make SQL queries to it.
const mysql = require('mysql2');
//Using 'dotenv' to create a configuration and define environmental variables that hide sensitive info in order to be able to connect to the database using the standard 'mysql2' method
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