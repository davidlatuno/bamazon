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
    var query = "SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS 'Total Sales', SUM(products.product_sales) - departments.over_head_costs AS 'Total Profit' FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY departments.id;"

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

// Asks user if they want to buy items
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
            } else {
                connection.end();
            }
        })
};

intro();