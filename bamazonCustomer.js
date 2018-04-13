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

// Call first function
productsTable();

// Holds products id
var productIdArray = [];

// Logs products to terminal using table npm package
function productsTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Title Row
         var data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
        // Add products to data array
        for (var i = 0; i < res.length; i++) {
            data.push(Object.values(res[i]));
            productIdArray.push(res[i].id);
        }
        // Prints table to console
        var result = table(data);
        console.log(result);
        // Call user input function
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
            // If user does not confirm as prompt again
            if (!input.confirm) {
                buyID();
            } else {
                var userID = parseInt(input.id);
                var userAmount = parseInt(input.number);

                // User validation for NaN
                if (isNaN(userID) || isNaN(userAmount)) {
                    console.log("\nINVALID ID or AMOUNT ENTERED\n");
                    buyID();
                } else {
                    // Second level of user validation for correct id numbers and positive purchase amoutns
                    if (productIdArray.includes(userID) && userAmount > 0) {
                        readID(input.id, input.number, purchase);
                    } else {
                        console.log("\nITEM DOES NOT EXIST or INVALID PRODUCT AMOUNT\n");
                        buyID();
                    }
                }
            }
        })
};

// Reads database when user inputs valid query
function readID(productId, productPurchase, callback) {
    connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
        if (err) throw err;
        // Holds the current quantity of item chosen
        var currentQuant = res[0].stock_quantity;
        // Calculates total charged to customer
        var price = (res[0].price) * productPurchase;
        // Calculates new product quantity
        var newQuant = currentQuant - productPurchase;
        // Validation if not enough inventory
        if (newQuant < 0) {
            console.log("\nINSUFFICIENT QUANTITY!\n");
            intro();
        } else {
            callback(newQuant, productId, price);
        }
    });
};

// Function to update product quantity on database
function purchase(newQuant, ID, price) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuant
            },
            {
                id: ID
            }
        ], function (err, res) {
            if (err) throw err;
            console.log("\nPURCHASE OF " + price + " COMPLETE\n");
            // Call original user prompt again after 2 seconds
            setTimeout(productsTable, 2000);
        })
}