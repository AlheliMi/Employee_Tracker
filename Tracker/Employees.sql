DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments(
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  department_name VARCHAR (100) NOT NULL
);

CREATE TABLE roles(
	id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR (100) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INTEGER,
  CONSTRAINT FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE TABLE employees(
  employee_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR (100) NOT NULL,
  last_name VARCHAR (100) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  CONSTRAINT FOREIGN KEY (role_id) REFERENCES roles (id) 
);

INSERT INTO departments (department_name)
VALUES ("Management"),("Human Resources"),("Finance"),("Legal");

INSERT INTO roles (department_id, title, salary)
VALUES (1, "Chief Executive Officer", 100000), (1, "Chief Operating Officer", 95000), (1, "Chief Marketing Officer", 90000),
(2, "Human Resources officer", 50000), (2, "Recruitment Researcher", 45000), (2, "Training and development officer", 43000),
(3, "Chief Financial Officer", 88000), (3, "Financial Analyst", 85000), (3, "Chief Accountant Officer", 88000),
(4, "Chief Legal Officer", 90000), (4, "Lawyer", 80000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ernesto", "Aguilar", 1, 1), ("Tadeo", "Medina", 2, 1), ("Alfonso", "Sánchez", 3, 1), 
("María", "Flores", 4, 2), ("Lourdes", "Campos", 5, 2), ("Edmundo", "Miranda", 6, 2),
("Ariel", "Siren", 7, 3),("Alice", "Wonderland", 8, 3),("Flynn", "Rider", 9, 3),
("José", "Madero", 10, 4), ("Ricky", "Treviño", 11, 4);

SELECT *
FROM employees;

SELECT employee_id, first_name, last_name, title, department, salary, manager_id
FROM employees;

SELECT *
FROM departments;

SELECT *
FROM roles;

-- Query for view all --
SELECT e.employee_id, e.first_name, e.last_name, d.department_name AS departments, r.title, r.salary, 
CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employees e 
LEFT JOIN employees m ON m.employee_id = e.manager_id INNER JOIN roles r ON e.role_id = r.id 
INNER JOIN departments d ON r.department_id = d.id ORDER BY e.employee_id ASC;

-- Query for view all roles --
SELECT  r.id, r.title, r.salary, d.department_name as Department_Name FROM roles AS r 
INNER JOIN departments AS d ON r.department_id = d.id;

-- Query for getting employees --
SELECT employee_id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employees ;

-- Query for updating --
UPDATE employees SET role_id = 3 WHERE  employee_id= 8;

-- Query for Delete --
DELETE FROM departments  WHERE id= 14;