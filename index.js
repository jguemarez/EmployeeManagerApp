//This module initiates the application by importing and invoking the following functions and methods. It also prints out a welcoming message to the terminal.
const startCLI = require('./lib/inquire_query.js') ;
const db = require('./config/connection.js');
const displayTitle = require('./lib/asciiTitle.js');

db.connect((err) => {

    if (err) throw err;

    displayTitle();

    console.info(`
      Welcome to the Employee Manager App v 1.0.0. Just select the option that better suites your needs from our intuitive menu and follow the queries to rapidly retrieve and modify info 
    from our employee database. 
    `);

    startCLI();
  })
