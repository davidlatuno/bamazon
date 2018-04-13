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

// Logs products to terminal using table npm package
function productsTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Title Row
        data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
        // Add products to data array
        for (var i = 0; i < res.length; i++) {
            data.push(Object.values(res[i]));
        }
        // Prints table to console
        var result = table(data);
        console.log(result);
    });
}

productsTable();