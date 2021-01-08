const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet")

//CONNECTION TO THE DATABASE
var connection = mysql.createConnection({
    host: "localhost",

    //CHOSEN PORT
    port: 3306,
    user: "root",
    password: "Alheli@17Mi",
    database: "employees_db"
});

figlet("Employee Tracker APP",(err, result) =>{
    console.log(err || result);
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
        employeesInfo();
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        console.table(data);
        employeesInfo();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, data) {
        if (err) throw err;
        console.table(data);
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

async function deleteDepartment(){
    var departmentArray=[];
    connection.query(`
    SELECT departments.department_name AS 'Department_Name'
    FROM departments;`
    , function(err, result) {
        if (err) throw err;

        for(var i=0; i<result.length; i++){
            departmentArray.push(result[i].Department_Name);
        }
        console.log(" ");
        
        inquirer
        .prompt([
        {
            type: "rawlist",
            name: "department",
            message: "Select the Department you want to remove: ",
            choices:departmentArray
        }
        ]).then(function(response){
            connection.query(`SELECT departments.id FROM departments
            WHERE departments.department_name=?;`
            , [response.departments], function(err, result) {
                if (err) throw err;
                var departmentID=result[0].id;
                connection.query(`DELETE FROM departments WHERE departmets.id=?;`
                    , [departmentID], function(err, result) {
                    if (err) throw err;
                    console.log(" ");
                    console.log(`Department: ${response.department} was Successfully Removed.`);
                    viewDepartment();
                });   
            });   
        })
    });
};

 async function deleteRole(){
    var roleArray=[];
    connection.query(`
    SELECT 
    CONCAT(roles.title, ' ',roles.department_id) AS 'Role_Name'
    FROM roles;`
    , function(err, result) {
        if (err) throw err;
        for(var i=0; i<result.length; i++){
            roleArray.push(result[i].Role_Name);
        }
        console.log(" aqui ESTOY");

        inquirer
        .prompt([
        {
            type: "rawlist",
            name: "role",
            message: "Select the Role you want to remove: ",
            choices: roleArray
        }
        ]).then(function(response){
            connection.query(`SELECT roles.id FROM roles
            WHERE CONCAT(roles.title, ' ',roles.department_id)=?;`
            , [response.role], function(err, result) {
                if (err) throw err;
                var roleID=result[0].id;
                connection.query(`DELETE FROM roles WHERE roles.id=?;`
                    , [roleID], function(err, result) {
                    if (err) throw err;
                    console.log(" ");
                    console.log(`Role: ${response.role} was Successfully Removed.`);
                    viewRoles();
                });   
            });   
        })
    });
};

async function deleteEmployee(){
    var employeeArray=[];
    connection.query(`
    SELECT 
    CONCAT(employees.first_name, ' ',employees.last_name) AS 'Employee_Name'
    FROM employees;`
    , function(err, result) {
        if (err) throw err;

        for(var i=0; i<result.length; i++){
            employeeArray.push(result[i].Employee_Name);
        }
        console.log(" ");
        inquirer
        .prompt([
        {
            type: "rawlist",
            name: "employee",
            message: "Select the employee to remove: ",
            choices:employeeArray
        }
        ]).then(function(response){
            connection.query(`SELECT employees.employee_id FROM employees
            WHERE CONCAT(employees.first_name, ' ',employees.last_name)=?;`
            , [response.employee], function(err, result) {
                if (err) throw err;
                var employeeID=result[0].id;
                connection.query(`DELETE FROM employees WHERE employees.employee_id=?;`
                    , [employeeID], function(err, result) {
                    if (err) throw err;
                    console.log(" ");
                    console.log(`Employee: ${response.employee} was Successfully Removed.`);
                    viewEmployees();
                });   
            });   
        })
    });
};

