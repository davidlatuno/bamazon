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
        var data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
        // Add products to data array
        for (var i = 0; i < res.length; i++) {
            data.push(Object.values(res[i]));
        }
        // Prints table to console
        var result = table(data);
        console.log(result);
    });
}

// Logs products to terminal that have quantity less than 5 using table npm package
function lowTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Title Row
        var data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
        // Add products to data array
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                data.push(Object.values(res[i]));
            }
        }
        // Prints table to console
        var result = table(data);
        if (data.length === 1) {
            console.log("\nNO ITEMS HAVE STOCK QUANTITY LESS THAN 5\n");
        } else {
            console.log(result);
        }
    });
}

lowTable();