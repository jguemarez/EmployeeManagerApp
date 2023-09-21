//These data arrays contain useful info that is either employed by the inquirying and querying functions in inquire_query.js or could be used to eventually extend the functionality of the CMS
const options = [
    'View all departments',
    'View all roles',
    'View all employees',
    'View all department managers',
    'View all department directors',
    'View employees by department',
    'View employees by manager',
    'Add a department',
    'Add a role',
    'Add a regular employee',
    'Update a regular employee',
    'Update a manager',
    "Delete a regular employee's record",
    "Close a department",
    "Dispose of a regular role",
    "Get the total utilized budget of a department",
    'Exit'
  ];
  
const departments = [
    {
        name: 'Customer Service',
        value: 1
    },
    {
        name: 'Finance',
        value: 2
    },
    {
        name: 'Human Resources',
        value: 3
    },
    {
        name: 'Legal',
        value: 4
    },
    {
        name: 'Production',
        value: 5
    },
    {
        name: 'Research & Development',
        value: 6
    }

];

const reg_roles = [
    {
        value: 1,
        name: 'Assistant Software Engineer'
    },
    {
        value: 2,
        name: 'Senior Software Engineer'
    },
    {
        value: 3,
        name: 'Staff'
    },
    {
        value: 4,
        name: 'Senior Staff'
    },
    {
        value: 5,
        name: 'Accountant'
    },
    {
        value: 6,
        name: 'HR Specialist'
    },
    {
        value: 7,
        name: 'HR Analyst'
    },
    {
        value: 8,
        name: 'Salesperson'
    },
    {
        value: 9,
        name: 'Sales Associate'
    },
    {
        value: 10,
        name: 'Lawyer'
    }
];

const manag_roles = [
    {
        value: 11,
        name: 'Sales Lead'
    },
    {
        value: 12,
        name: 'HR Manager'
    },
    {
        value: 13,
        name: 'Finance Account Manager'
    },
    {
        value: 14,
        name: 'Staff Manager'
    },
    {
        value: 15,
        name: 'Lead Engineer'
    },
    {
        value: 16,
        name: 'Legal Team Lead'
    }
];

const dir_roles = [
    {
        value: 17,
        name: 'Head of Customer Service'
    },
    {
        value: 18,
        name: 'Director of HR'
    },
    {
        value: 19,
        name: 'Head of Finance'
    },
    {
        value: 20,
        name: 'Director of Manufacturing'
    },
    {
        value: 21,
        name: 'Top R&D Executive'
    },
    {
        value: 22,
        name: 'General Counsel'
    }
];

const added_roles = [];

const managers = [
    {
        name: 'Josiris Sandoval',
        value: 1
    },
    {
        name: 'Georgi Facello',
        value: 2
    },
    {
        name: 'Juliana Ramos',
        value: 103
    },
    {
        name: 'Paraskevi Luby',
        value: 104
    },
    {
        name: 'Zaadia Rios',
        value: 205
    },
    {
        name: 'Greger Lichtner',
        value: 206
    },
    {
        name: 'Alba Maldonado',
        value: 256
    },
    {
        name: 'Shirish Wegerle',
        value: 257
    },
    {
        name: 'Alejandra Maldonado',
        value: 357
    },
    {
        name: 'Erzsebet Ohori',
        value: 358
    },
    {
        name: 'Ivonne Guemarez',
        value: 458
    },
    {
        name: 'Werner Hasham',
        value: 459
    }
];

const dept_directors = [
    {
        name: 'Wilfredo Maldonado',
        value: 509
    },
    {
        name: 'Abeela Mohammed',
        value: 510
    },
    {
        name: 'Nabeela Raouf',
        value: 511
    },
    {
        name: 'Itzel Carrire',
        value: 512
    },
    {
        name: 'Itzel Carrire',
        value: 513
    },
    {
        name: 'Carmen Guemarez',
        value: 514
    }
];

module.exports = { departments, reg_roles, manag_roles, dir_roles, managers, dept_directors, options, added_roles };