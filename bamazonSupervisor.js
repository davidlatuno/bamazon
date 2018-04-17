// Package initializations
var mysql = require("mysql");
var { table } = require("table");
var inquirer = require("inquirer");

// Connection to server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

// Logs profits table to terminal using table npm package
function profitTable() {
    // SQL query for total profits
    var query = "SELECT departments.id, departments.department_name, departments.over_head_costs, IF(SUM(products.product_sales) is NULL, 0.00, SUM(products.product_sales)) AS 'Total Sales', IF(SUM(products.product_sales) is NULL, 0.00 - departments.over_head_costs, 0.00 - departments.over_head_costs) AS 'Total Profit' FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY departments.id;"

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Title Row
        var data = [["ID", "DEPARTMENT NAME", "OVERHEAD COSTS", "TOTAL SALES", "TOTAL PROFIT"]];
        // Add info to data array
        for (var i = 0; i < res.length; i++) {
            var newProduct = Object.values(res[i])
            data.push(newProduct);
        }
        // Prints table to console
        var result = table(data);
        console.log(result);
        intro();
    });
}

// Asks user for action
function intro() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["VIEW PRODUCT SALES BY DEPARTEMENT", "CREATE NEW DEPARTMENT", "EXIT"],
                name: "first"
            }
        ])
        .then(function (input) {
            if (input.first === "VIEW PRODUCT SALES BY DEPARTEMENT") {
                profitTable();
            } else if (input.first === "CREATE NEW DEPARTMENT") {
                inquireAdd();
            } else {
                connection.end();
            }
        })
};

// Inquirer for add department
function inquireAdd() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "name",
                validate: emptyValidate
            },
            {
                type: "input",
                message: "What is the initial overhead costs of the department?",
                name: "cost",
                validate: amountValidate
            },
            {
                message: "Are you sure?",
                type: "confirm",
                name: "confirm",
                default: true,
            }
        ])
        .then(function (input) {
            if (!input.confirm) {
                inquireAdd();
            } else {
                addDepartment(input.name, input.cost);
            }
        })
}

// Function that adds department to database
function addDepartment(name, costs) {
    connection.query("INSERT INTO departments SET ?", {
        department_name: name,
        over_head_costs: costs,
    }, function (err, res) {
        console.log("\nDEPARTMENT SUCCESSFULLY ADDED!\n");
        intro();
    })
};

// Validate for empty fields 
function emptyValidate(input) {
    // Declare function as asynchronous, and save the done callback
    var done = this.async();

    // Do async stuff
    setTimeout(function () {
        if (input === "") {
            // Pass the return value in the done callback
            done('Required Field');
            return;
        }
        // Pass the return value in the done callback
        done(null, true);
    }, 1000);
}

// Validate if amount is a positive number 
function amountValidate(input) {
    // Declare function as asynchronous, and save the done callback
    var done = this.async();

    // Do async stuff
    setTimeout(function () {
        if (isNaN(input) || parseInt(input) < 0 || input === "") {
            // Pass the return value in the done callback
            done('Positive number not entered');
            return;
        }
        // Pass the return value in the done callback
        done(null, true);
    }, 1000);
}

intro();