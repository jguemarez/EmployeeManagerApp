const inquirer = require("inquirer");
const db = require('../config/connection.js');
const { managers, dept_directors, options, manag_roles } = require('./dataArrays.js');

const showEmployees = () => {
    sql =
        `SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, 
    role.title AS Role, role.salary AS Salary, department.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    LEFT JOIN employee AS Manager ON employee.manager_id = manager.id  
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY Last_Name;
    `;
    db.query(
        sql,
        (err, rows) => {
            err ? console.log(err) : console.table(rows);
            startCLI();
        });
};

const showDepartments = () => {
    sql = `SELECT id AS ID, name AS Name FROM department`;
    db.query(
        sql,
        (err, rows) => {
            err ? console.log(err) : console.table(rows);
            startCLI();
        });
};

const showRoles = () => {
    sql =
        `SELECT role.id AS ID, role.title AS Role, role.salary AS Salary, department.name AS Department
    FROM role
    LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        err ? console.log(err) : console.table(rows);
        startCLI();
    });
};

const showDeptManagers = () => {

    db.query(
        `SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, 
role.title AS Role, role.salary AS Salary, department.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM employee
LEFT JOIN employee AS Manager ON employee.manager_id = manager.id  
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE employee.role_id >= 11 AND employee.role_id <= 16
ORDER BY Department;`,
        (err, rows) => {
            err ? console.error(err) : console.table(rows);
            startCLI();
        }
    );

}

const showDeptDirectors = () => {

    db.query(
        `SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, 
    role.title AS Role, role.salary AS Salary, department.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    LEFT JOIN employee AS Manager ON employee.manager_id = manager.id  
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE employee.role_id >= 17 AND employee.role_id <= 22
    ORDER BY Department;`,
        (err, rows) => {
            err ? console.error(err) : console.table(rows);
            startCLI();
        }
    );

}
const showEmpByDept = () => {

    let deptsArr;

    let chosenDepartment;

    const getDeptQuery = `SELECT id, name FROM department;`;

    const getDeptPromise = new Promise((resolve, reject) => {

        db.query(getDeptQuery,
            (err, rows) => {
                if (err) reject(err);
                resolve(deptsArr = rows.map((department) => {
                    return {
                        name: department.name,
                        value: department.id,
                    }
                }));
            });

    });

    Promise.any([getDeptPromise]).then((ans) => {

        deptsArr = ans.flat(1);

        inquirer.prompt([
            {
                type: "list",
                name: "department",
                choices: deptsArr,
                message: "Choose the department for which you want to see the employees."
            }
        ]).then(({ department }) => {

            const getNamePromise = new Promise((resolve, reject) => {
                db.query(`SELECT name FROM department
        WHERE id = ${department}`,
                    (err, result) => {
                        if (err) reject(err);
                        resolve(chosenDepartment = result[0].name);
                    });
            })

            Promise.any([getNamePromise])
                .then((ans) => {
                    console.log(ans);
                    chosenDepartment = ans;
                    sql = `SELECT CONCAT(employee.first_name," ", employee.last_name) AS Employees_From_${chosenDepartment.split(' ').join('_')}
        FROM ((department 
        INNER JOIN role ON role.department_id = department.id)
        INNER JOIN employee ON employee.role_id = role.id)
        WHERE department.name = '${chosenDepartment}'
        ORDER BY employee.last_name;`

                    db.query(
                        sql,
                        (err, rows) => {
                            err ? console.log(err) : console.table(rows);
                            startCLI();
                        });
                });
        })
    }).catch((err) => { throw err })
}

const showEmpByMan = () => {

    let managerArr;
    let chosenManager;

    const getManagersPromise = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM employee
    WHERE role_id >= 11 AND role_id <=22;`,
            (err, rows) => {
                if (err) reject(err);
                resolve(managerArr = rows.map((manager) => {
                    return {
                        value: manager.id,
                        name: `${manager.first_name} ${manager.last_name}`
                    }
                }));
            })
    });

    Promise.any([getManagersPromise]).then((ans) => {

        managerArr = ans.flat(1);

        inquirer.prompt([{
            type: 'list',
            name: 'manager',
            choices: managerArr,
            message: 'Choose a manager to see which employees are under his/her supervision.'
        }]).then(({ manager }) => {

            const getManName = new Promise((resolve, reject) => {
                db.query(`SELECT CONCAT(first_name, "_", last_name) AS name FROM employee
        WHERE id = ${manager}`,
                    (err, row) => {
                        if (err) reject(err);
                        resolve(chosenManager = row[0].name);
                    })
            });

            Promise.any([getManName]).then((ans) => {
                console.log(chosenManager);
                chosenManager = ans;

                db.query(`SELECT CONCAT(first_name," ", last_name) AS Employees_Managed_By_${chosenManager} FROM employee 
        WHERE manager_id = ${manager}
        ORDER BY last_name;`,
                    (err, rows) => err ? console.error(err) : console.table(rows));
                startCLI();
            })
        })
    })
}

const res = {};

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

const selectManagerForManager = (role) => {

    if (role === 11) return dept_directors[0].value;
    if (role === 12) return dept_directors[1].value;
    if (role === 13) return dept_directors[2].value;
    if (role === 14) return dept_directors[3].value;
    if (role === 15) return dept_directors[4].value;
    if (role === 16) return dept_directors[5].value;
    return 0;

}


const addRegEmployee = () => {

    let roleArr;

    const getRoleQuery = `SELECT * FROM role
    WHERE id <= 10 OR id >= 23;`

    const getRolePromise = new Promise((resolve, reject) => {
        db.query(getRoleQuery, (err, rows) => {
            if (err) reject(err);
            resolve(rows.map(({ id, title }) => ({
                name: title,
                value: id
            })));
        });
    });

    Promise.all([getRolePromise])
        .then((ans) => {

            roleArr = ans.flat(1);

            const questions = [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the new employee's first name?",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the new employee's last name?",
                },
                {
                    type: "list",
                    name: "role",
                    choices: roleArr,
                    message: "Choose the employee's role:",
                }
            ];

            inquirer
                .prompt(questions)
                .then((ans) => {
                    res.first_name = ans.first_name;
                    res.last_name = ans.last_name;
                    res.role_id = ans.role;
                    return selectManagerForRegEmp(res.role_id)
                })
                .then(({ manager }) => {
                    res.manager_id = manager;
                    return res;
                })
                .then((res) => {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ( ?, ?, ?, ?);`;
                    const fieldValues = [res.first_name, res.last_name, res.role_id, res.manager_id];
                    db.query(
                        sql,
                        fieldValues,
                        (err, result) => {
                            if (err) console.error(err);
                            const employeeRole = roleArr.find((role) => role.value === res.role_id);
                            const employeeManager = managers.find((manager) => manager.value === res.manager_id);
                            if (res.role_id <= 10) {
                                console.info(`
                                New employee ${res.first_name} ${res.last_name}, with role ${employeeRole.name} and under the supervision of ${employeeManager.name}, was added to the database.
                                The number of affected rows in the 'employee' table is ${result.affectedRows}.
                                `);
                            } else {
                                console.info(`
                                New employee ${res.first_name} ${res.last_name}, with role ${employeeRole.name} and under the temporary supervision of ${employeeManager.name}, was added to the database.
                                The number of affected rows in the 'employee' table is ${result.affectedRows}.
                                `);
                            };

                            startCLI();
                        });
                }).catch(err => console.log(err));
        }).catch(err => { throw err })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "department_name",
                message: "What will be the new department's name?",
            },
        ])
        .then((res) => {
            const sql = `INSERT INTO department (name) 
        VALUES (?);`;
            db.query(
                sql,
                res.department_name,
                (err, result) => {
                    if (err) console.error(err);

                    console.info(`
                    A new department, ${res.department_name}, has been created. Position of department director is open.
                    The number of affected rows in the 'department' table is ${result.affectedRows}.
                    `);
                    startCLI();
                }
            );
        }).catch(err => console.log(err));
};
const addRegRole = () => {

    let deptsArr;

    const getDeptsQuery = `SELECT * from department`

    const getDeptsPromise = new Promise((resolve, reject) => {
        db.query(getDeptsQuery, (err, rows) => {

            if (err) reject(err);

            resolve(rows.map(({ id, name }) => ({
                name: name,
                value: id
            })));
        });
    });

    Promise.all([getDeptsPromise])
        .then((ans) => {

            deptsArr = ans.flat(1);

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "role_name",
                        message: "What is the name of the regular role to be added?",
                    },
                    {
                        type: "input",
                        name: "role_salary",
                        message: "What will be the annual salary for the new role?",
                    },
                    {
                        type: "list",
                        name: "role_department",
                        choices: deptsArr,
                        message: "To which department does the new role belongs to?",
                    },
                ])
                .then((ans) => {
                    const sql = `INSERT INTO role (title, salary, department_id) 
        VALUES (?, ?, ?);`;
                    db.query(
                        sql,
                        [ans.role_name, ans.role_salary, ans.role_department],
                        (err, result) => {
                            if (err) console.error(err);

                            const department = deptsArr.find(dept => dept.value === ans.role_department);

                            console.info(`
                            A new non-management role, ${ans.role_name}, earning an annual salary of ${ans.role_salary}, was added to the ${department.name} department and written to the database.
                            The number of affected rows in the 'role' table is ${result.affectedRows}.
                            `);
                            startCLI();
                        }
                    );
                });
        }).catch(err => { throw err })
}

const updateRegEmployee = () => {

    let roleArr;

    const getRoleQuery = `SELECT * FROM role
    WHERE id <= 10 OR id >= 23;`

    const getRolePromise = new Promise((resolve, reject) => {
        db.query(getRoleQuery, (err, rows) => {
            if (err) reject(err);
            resolve(rows.map(({ id, title }) => ({
                name: title,
                value: id
            })));
        });
    });

    Promise.all([getRolePromise])
        .then((ans) => {

            roleArr = ans.flat(1);
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "What is the first name of the employee you want to update?",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "What is the last name of the employee you want to update?",
                    }
                ]).then((ans) => {

                    res.first_name = ans.first_name;
                    res.last_name = ans.last_name;

                    const sql = `SELECT 1 FROM employee
                WHERE first_name = ? AND last_name = ?;`;

                    db.query(
                        sql,
                        [ans.first_name, ans.last_name],
                        (err, rows) => {
                            console.log(ans.first_name, ans.last_name);
                            if (err) {
                                console.error(err);
                            }
                            if (rows.length === 0) {

                                console.info(`
                        \u001b[31m Sorry. There is no record for the chosen employee in the database.
                        `);
                                return startCLI();
                            }
                            else {

                                inquirer.prompt([
                                    {
                                        type: "list",
                                        name: "role",
                                        choices: roleArr,
                                        message: "What will be the new role for the employee?",
                                    },

                                ]).then(({ role }) => {

                                    res.role_id = role;
                                    selectManagerForRegEmp(role).then(({ manager }) => {
                                        res.manager_id = manager;
                                        const sql2 = `UPDATE employee 
                                        SET role_id = ?, manager_id = ? 
                                        WHERE first_name = '${res.first_name}' AND last_name = '${res.last_name}';`;
                                        db.query(
                                            sql2,
                                            [res.role_id, res.manager_id],
                                            (err, result) => {
                                                if (err) console.error(err);

                                                const updatedRole = roleArr.find(role => role.value === res.role_id)
                                                const updatedManager = managers.find(manager => manager.value === res.manager_id);
                                                console.info(`
                                        Employee ${res.first_name} ${res.last_name} now has the role of ${updatedRole.name} and is under the supervision ${updatedManager.name}.
                                        The number of affected rows in the 'employee' table is ${result.affectedRows}.
                                        `);


                                                startCLI();
                                            });
                                    });

                                });

                            }
                        });

                });
        });
}

const updateEmployeeManagers = () => {


    let empArr;
    let chosenEmp;
    let chosenRole;
    let director;

    const getEmpQuery = `
      SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
      FROM employee
      WHERE role_id <= 10 OR role_id >= 23;
    `;

    db.query(getEmpQuery, (err, rows) => {
        if (err) throw err;

        empArr = rows.map((employee) => ({
            name: employee.employee_name,
            value: employee.id,
        }));
    });

    const createUpdateMessage = (emp_id, man_role_id) => {

        db.query(`SELECT title FROM role
        WHERE id = ${man_role_id};`,
            (err, result) => {
                if (err) throw err;
                chosenRole = result[0].title;
                return chosenRole;
            })
        db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee
        WHERE id = ${emp_id};`,
            (err, result) => {
                if (err) throw err;
                chosenEmp = result[0].name
                return chosenEmp;
            });
        db.query(`SELECT CONCAT(first_name, " ", last_name) as name FROM employee
        WHERE id = ${selectManagerForManager(man_role_id)};`,
            (err, result) => {
                if (err) throw err;
                director = result[0].name;
                return director;
            })

        db.query(`UPDATE employee 
        SET role_id = ${man_role_id}, manager_id = ${selectManagerForManager(man_role_id)}
        WHERE id = ${emp_id};`,
            (error, result) => {
                if (error) throw error;

                console.info(`
                The employee ${chosenEmp} has been updated and now has management role '${chosenRole}' under the direction of ${director}.
                The number of updated rows in the employee table is ${result.affectedRows}.
                `);
                startCLI();
            });
    }

    inquirer.
        prompt(
            [
                {
                    type: 'confirm',
                    name: 'emp_status',
                    message: 'Is the employee to be updated currently a manager?'
                }
            ]
        ).then(({ emp_status }) => {
            if (emp_status) {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        choices: managers,
                        message: "Which manager do you want to update?"
                    },
                    {
                        type: 'list',
                        name: 'new_management_role',
                        choices: manag_roles,
                        message: "Which new management position will be assigned to the chosen manager?"
                    }
                ]).then(({ manager, new_management_role }) => createUpdateMessage(manager, new_management_role));
            } else {

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        choices: empArr,
                        message: 'Which regular employee do you want to ascend to manager?'
                    },
                    {
                        type: 'list',
                        name: 'new_management_role',
                        choices: manag_roles,
                        message: "Which management position will be assigned to the chosen employee?"
                    }]).then(({ employee, new_management_role }) => createUpdateMessage(employee, new_management_role));
            }
        });
}


const deleteRegEmployee = () => {

    let empArr;
    let chosenEmp;

    const getEmpQuery = `
      SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
      FROM employee
      WHERE role_id <= 10 OR role_id >= 23;
    `;

    db.query(getEmpQuery, (err, rows) => {
        if (err) throw err;

        empArr = rows.map((employee) => ({
            name: employee.employee_name,
            value: employee.id,
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Which regular employee's record would you like to erase?",
                    choices: empArr,
                },
            ])
            .then((ans) => {

                chosenEmp = empArr.find((employee) => employee.value === ans.employee);

                const sql = `DELETE FROM employee WHERE id = ?;`;
                db.query(sql,
                    [ans.employee],
                    (err, result) => {
                        if (err) throw err;

                        console.info(`
                        Deleted the record for employee ${chosenEmp.name}.
                        The total number of deleted rows in the 'employee' table is ${result.affectedRows}
                         `);
                        startCLI();
                    });
            });
    });
};


const deleteDepartment = () => {

    let deptsArr;

    let chosenDepartment;

    const getDeptQuery = `SELECT id, name FROM department;`;

    db.query(getDeptQuery,
        (err, rows) => {
            if (err) throw err;

            deptsArr = rows.map((department) => ({
                name: department.name,
                value: department.id,
            }));

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Which department would you like to close?",
                        choices: deptsArr,
                    }
                ])
                .then((ans) => {

                    chosenDepartment = deptsArr.find((department) => department.value === ans.department);

                    const sql1 = `DELETE FROM role WHERE department_id = ?;`

                    const sql2 = `DELETE FROM department WHERE id = ?;`

                    db.query(sql1,
                        [ans.department],
                        (err, result) => {
                            if (err) throw err;
                            console.info(`
                            All the roles associated with ${chosenDepartment.name} were deleted from record.
                            The number of deleted rows in the 'role' table were ${result.affectedRows}.
                            `);
                        })

                    db.query(sql2,
                        [ans.department],
                        (err, result) => {
                            if (err) throw err;
                            console.info(`
                            The department ${chosenDepartment.name} was successfully closed.
                            The number of deleted rows in the 'department' table is ${result.affectedRows}.
                            `);
                            startCLI();
                        });
                });
        });
};

const deleteRegRole = () => {

    let rolesArr;
    let chosenRole;
    let chosenRoleDept = {};

    const getRoleQuery = `
     SELECT id, title FROM role
     WHERE id <=10 OR id >=23;
   `;

    db.query(getRoleQuery, (err, rows) => {
        if (err) throw err;

        rolesArr = rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Which role would you like to remove from record?",
                    choices: rolesArr,
                },
            ])
            .then((ans) => {

                chosenRole = rolesArr.find((role) => role.value === ans.role);

                const promise1 = new Promise((resolve, reject) => {
                    db.query(`SELECT department_id FROM role 
                WHERE id =?;`,
                        chosenRole.value,
                        (err, rows) => {
                            if (err) reject(err);
                            resolve(chosenRoleDept.id = rows[0].department_id);
                        });
                });


                Promise.any([promise1]).then((id) => {

                    chosenRoleDept.id = id;

                    const promise2 = new Promise((resolve, reject) => {
                        db.query(`SELECT name FROM department
                WHERE id = ${chosenRoleDept.id}`,
                            (err, result) => {
                                if (err) reject(err);
                                resolve(chosenRoleDept.name = result[0].name);
                            });
                    });
                    Promise.any([promise2]).then((name) => {

                        chosenRoleDept.name = name;

                        const sql = `DELETE FROM role WHERE id = ?;`;

                        db.query(sql,
                            [chosenRole.value],
                            (err, result) => {
                                if (err) throw err;
                                console.info(`
                        The role '${chosenRole.name}', that belonged to the  ${chosenRoleDept.name} department (with id =  ${chosenRoleDept.id}), was deleted from record.
                        The number of deleted rows in the 'role' table is ${result.affectedRows}.
                         `);
                                startCLI();
                            });
                    });
                });

            });
    })
}

const getTotalUtilBudget = () => {

    let deptsArr;

    const getDeptQuery = `SELECT id, name FROM department;`;

    const getDeptPromise = new Promise((resolve, reject) => {
        db.query(getDeptQuery,
            (err, rows) => {
                if (err) reject(err);

                resolve(deptsArr = rows.map((department) => {

                    const deptOBJ = {
                        name: department.name,
                        value: department.id
                    }
                    return deptOBJ;
                }));
            });
    });

    Promise.any([getDeptPromise]).then((ans) => {

        deptsArr = ans.flat(1);

        inquirer.prompt([{
            type: 'list',
            name: 'department',
            choices: deptsArr,
            message: 'Choose a department in order to view its total utilized budget.'
        }]).then(({ department }) => {

            sql = `SELECT SUM(role.salary) AS TOTAL_UTILIZED_BUDGET
            FROM ((department
            INNER JOIN role ON role.department_id = department.id)
             INNER JOIN employee ON employee.role_id = role.id)
             WHERE department.id = ?;`

            db.query(sql,
                department,
                (err, rows) => {
                    err ? console.error(err) : console.table(rows);
                    startCLI();
                });
        });
    }).catch((err) => console.error(err))

};


function startCLI() {

    return inquirer
        .prompt([{
            type: 'list',
            choices: options,
            name: 'main',
            message: '\u001b[33m What would you like to do?',
        }])
        .then((answer) => {
            if (answer.main === options[0]) showDepartments();
            if (answer.main === options[1]) showRoles();
            if (answer.main === options[2]) showEmployees();
            if (answer.main === options[3]) showDeptManagers();
            if (answer.main === options[4]) showDeptDirectors();
            if (answer.main === options[5]) showEmpByDept();
            if (answer.main === options[6]) showEmpByMan();
            if (answer.main === options[7]) addDepartment();
            if (answer.main === options[8]) addRegRole();
            if (answer.main === options[9]) addRegEmployee();
            if (answer.main === options[10]) updateRegEmployee();
            if (answer.main === options[11]) updateEmployeeManagers();
            if (answer.main === options[12]) deleteRegEmployee();
            if (answer.main === options[13]) deleteDepartment();
            if (answer.main === options[14]) deleteRegRole();
            if (answer.main === options[15]) getTotalUtilBudget();
            if (answer.main === options[16]) {
                db.end();
                console.log('Connection to database ended. Goodbye.');
            }
        })
        .catch((err) => {
            console.log('\u001b[31m\nFail: Unfortunately, something went wrong.\n\u001b[0m');
            console.error(err);
        });

}

module.exports = startCLI;