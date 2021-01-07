var mysql = require("mysql");
var inquirer = require("inquirer");
let departments
let roles
let employees

//CONNECTION TO THE DATABASE
var connection = mysql.createConnection({
    host: "localhost",

    //CHOSEN PORT
    port: 3306,
    user: "root",
    password: "Alheli@17Mi",
    database: "employees_db"
});

connection.connect(function(err){
    if(err) throw err;
    employeesInfo();
});

//PROMPT THE USER
function employeesInfo() {
    inquirer.prompt({
        message: "Welcome to the Employee Tracker App, what would you like to do?",
        type: "list",
        name: "choice",
        choices: [
            "Add Employee",
            "Add Department",
            "Add Role",
            "View Employees",
            "View Departments",
            "View Roles",
            "Update Employee Manager",
            "Update Employee Role",
            "Delete Employee",
            "Delete Department",
            "Delete Role",
            "Exit Program"
        ]
    }).then(answers => {
        switch (answers.choice) {
            case "Add Employee":
                addEmployee()
                break;
            case "Add Department":
                addDepartment()
                break;    
            case "Add Role":
                addRole()
                break;
            case "View Employees":
                viewEmployees()
                break;
            case "View Departments":
                viewDepartments()
                break;
            case "View Roles":
                viewRoles()
                break;
            case "Update Employee Manager":
                updateEmployeeManager()
                break;
            case "Update Employee Role":
                updateEmployeeRole()
                break;
            case "Delete Employee":
                deleteEmployee()
                break;
            case "Delete Department":
                deleteDepartment()
                break;
            case "Delete Role":
                deleteRole()
                break;
            case "Exit Program":
                console.log("See you Next Time!!!!");
                return;
        }
    });
}

//Adding employees, departments and roles
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "roleId",
            message: "What is their role?",
            choices: [
                "1 Manager",
                "2 Human Resources",
                "3 Financial",
                "4 Analyst Researcher",
                "5 Legal"
            ]
        },
        {
            type: "number",
            name: "managerId",
            message: "What is their manager's ID?"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [res.firstName, res.lastName, res.roleId[0], res.managerId], function (err, data) {
            if (err) throw err;
            console.log("Employee Successfully inserted!");
            viewEmployees();
        });
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What would you like your new department name to be?"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO departments (name) VALUES (?)", [res.department], function (err, data) {
            if (err) throw err;
            console.log(`${res.department} Department Succesfully inserted!`);
            employeesInfo();
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter employee's title"
        },
        {
            type: "number",
            name: "salary",
            message: "Enter employee's salary"
        },
        {
            type: "input",
            name: "departmentId",
            message: "Enter department ID"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [res.title, res.salary, res.departmentId], function (err, data) {
            if (err) throw err;
            console.log("Role Succesfully inserted!");
            viewRoles();
        });
    });
}

//View employees, departments and roles
function viewEmployees() {
    connection.query("SELECT * FROM employees", function (err, data) {
        if (err) throw err;
        console.table(data);
        employees = res;
        employeesInfo();
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        console.table(data);
        departments = data;
        employeesInfo();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, data) {
        if (err) throw err;
        console.table(data);
        roles = res
        employeesInfo();
    });
}

// Updating employee managers
async function updateEmployeeManager() {
    const employees = await connection.query("SELECT id, first_name, last_name FROM employees")
    const employeeChoices = employees.map(employees => ({
        name: `${employees.first_name} ${employees.last_name}`,
        value: employees.id
    }));

    const employeeId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the employee you would like to update:",
                choices: employeeChoices
            }
        );

    const managers = await connection.query("SELECT id, first_name, last_name FROM employees WHERE role_id=5")
    const managerChoices = managers.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id
    }))

    const managerId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select manager:",
                choices: managerChoices
            }
        );
    await connection.query("UPDATE employees SET manager_id= ? WHERE id= ?", [managerId.eName, employeeId.eName])
    console.log("Employee manager updated!")
    viewEmployees();
}

// updating employee roles
async function updateEmployeeRole() {
    const employees = await connection.query("SELECT id, first_name, last_name FROM employees")
    const employeeChoices = employees.map(employees => ({
        name: `${employees.first_name} ${employees.last_name}`,
        value: employees.id
    }));
    const employeeId = await inquirer.prompt(
        {
            type: "list",
            name: "eName",
            message: "Select the employee you would like to update:",
            choices: employeeChoices
        }
    );
    const roles = await connection.query("SELECT * FROM roles")
    const roleChoices = roles.map(roles => ({
        name: `${roles.id} ${roles.title} $${roles.salary}`,
        value: roles.id
    }));
    const roleId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select role:",
                choices: roleChoices
            }
        );
    await connection.query("UPDATE employees SET role_id= ? WHERE id= ?", [roleId.eName, employeeId.eName])
        console.log("Employee role updated!")
        viewEmployees();
}

// Deleting employees, departments and roles
deleteDepartment = () => {
    connection.query("SELECT department_name FROM departments", function (err, data) {
        if (err) throw err;
        console.table(data);
    console.log(data.lenght);

/*     let departmentOptions = [];
    for (var i = 0; i < data.lenght; i++) {
      departmentOptions.push(Object(data[i]));
    } */
});
};


    /* 
  
    inquirer.prompt([
      {
        name: "deleteDepartment",
        type: "list",
        message: "Select a department to delete",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < departmentOptions.length; i++) {
            choiceArray.push(departmentOptions[i])
          }
          return choiceArray;
        }
      }
    ]).then(answer => {
      for (i = 0; i < departmentOptions.length; i++) {
        if (answer.deleteDepartment === departmentOptions[i].name) {
          newChoice = departmentOptions[i].id
          connection.query(`DELETE FROM department Where id = ${newChoice}`), (err, res) => {
            if (err) throw err;
          };
          console.log("Department: " + answer.deleteDepartment + " Deleted Succesfully");
        }
      }
      viewDepartment();
    })
  }; */
      


/* async function deleteEmployee() {
    const employees = await connection.query("SELECT employeed_id, first_name, last_name FROM employees")
    const employeeChoices = employees.map(employees => ({
        name: `${employees.first_name} ${employees.last_name}`,
        value: employees.id
    }))

    const employeeId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the employee you want to delete:",
                choices: employeeChoices
            })

    await connection.query("DELETE from employees where id= ?", [employeeId.eName]);
    console.log("Employee Successfully deleted.")
    viewEmployees();
}

async function deleteDepartment() {
    const departments = await connection.query("SELECT * FROM departments")
    const departmentChoices = departments.map(dept => ({
        name: `${dept.name}`,
        value: dept.id
    }))

    const departmentId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the department you want to delete:",
                choices: departmentChoices
            })

    await connection.query("DELETE from departments where id=?", [departmentId.eName]);
    console.log("Department Successfully deleted.")
    viewDepartment();
}

async function deleteRole() {
    const roles = await connection.query("SELECT * FROM roles")
    const roleChoices = roles.map(roles => ({
        name: `${roles.title}`,
        value: roles.id
    }));

    const roleId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the role you want to delete:",
                choices: roleChoices
            });

    await connection.query("DELETE from roles where id= ?", [roleId.eName]);
    console.log("Role Successfully deleted.")
    viewRoles();
}; */
