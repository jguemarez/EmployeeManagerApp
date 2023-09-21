//Importing the necessary data arrays for the functions to have access to.
const { managers, dept_directors } = require("./dataArrays");

//Importing the 'inquirer' module in order to use its prompt method whithin selectManagerForRegEmp.
const inquirer = require('inquirer');

//This two helper functions will select a new manager for any existing non-director employee (whether regular employee or manager) that gets upadted.
//The manager of a regular employee is chosen depending to the department to which the employee is allocated. If the department was recently created, the employee is assigned a temporary manager randomly.
const selectManagerForRegEmp = (role) => {

    let options;
    if (role === 1 || role === 2) options = [managers[0], managers[1]];
    if (role === 3 || role === 4) options = [managers[2], managers[3]];
    if (role === 5) options = [managers[4], managers[5]];
    if (role === 6 || role === 7) options = [managers[6], managers[7]];
    if (role === 8 || role === 9) options = [managers[8], managers[9]];
    if (role === 10) options = [managers[10], managers[11]];
    if (role > 10) options = [managers[Math.floor(Math.random() * 12)]]
    return inquirer.prompt([{
        type: "list",
        name: "manager",
        choices: options,
        message: "Choose the employee's manager:",
    }])

}

//For the field-level managers of the core departments, their manager will be the head/director of said department.
const selectManagerForManager = (role) => {

    if (role === 11) return dept_directors[0].value;
    if (role === 12) return dept_directors[1].value;
    if (role === 13) return dept_directors[2].value;
    if (role === 14) return dept_directors[3].value;
    if (role === 15) return dept_directors[4].value;
    if (role === 16) return dept_directors[5].value;
    return 0;

}

module.exports = { selectManagerForManager, selectManagerForRegEmp };