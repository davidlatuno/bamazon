var mysql = require("mysql");
var { table } = require("table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
    for (var i = 0; i < res.length; i++) {
        data.push(Object.values(res[i]));
    }
    var result = table(data);
    console.log(result);
    intro();
});

function intro() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["BUY", "EXIT"],
                name: "first"
            }
        ])
        .then(function (input) {
            if (input.first === "BUY") {
                buyID();
            } else {
                connection.end();
            }
        })
};

function buyID() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the item you would like to buy?",
                name: "id"
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "number"
            },
            {
                message: "Are you sure?",
                type: "confirm",
                name: "confirm",
                default: true
            }
        ])
        .then(function (input) {
            if (!input.confirm) {
                buyID();
            } else {
                readID(input.id, input.number, purchase);
            }
        })
};

function readID(productId, productPurchase, callback) {
    connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
        if (err) throw err;
        var currentQuant = res[0].stock_quantity;
        var newQuant = currentQuant - productPurchase
        callback(newQuant, productId);
    });
};

function purchase(newQuant, ID) {
    connection.query("UPDATE products SET ? WHERE ?", 
    [
        {
            stock_quantity: newQuant
        },
        {
            id: ID
        }
    ], function(err, res) {
        if (err) throw err;
        console.log("PURCHASE COMPLETE");
    })
}