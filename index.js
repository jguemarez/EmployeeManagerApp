const startCLI = require('./lib/inquire_query.js') ;
const db = require('./config/connection.js');

db.connect((err) => {
    if (err) throw err;
    //displayTitle();
    console.info(`
      Welcome to the Employee Tracker App v 1.0.0. Just select the option that better suites your needs from our intuitive menu and follow the queries to rapidly retrieve and modify info 
    from our employee database. 
    `);
    startCLI();
  })
