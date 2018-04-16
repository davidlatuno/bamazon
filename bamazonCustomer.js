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
        for (var i = 0; i < res.length - 1; i++) {
            var newProduct = Object.values(res[i])
            newProduct.pop()
            data.push(newProduct);
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
                name: "id",
                validate: idValidate
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "number",
                validate: amountValidate
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
                readID(input.id, input.number, purchase, readIdOverhead);
            }
        })
};

// Reads database when user inputs valid query
function readID(productId, productPurchase, callback1, callback2) {
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
            callback1(newQuant, productId, price);
            callback2(productId, productPurchase, overHead)
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
            console.log("\nPURCHASE OF $" + price + " COMPLETE\n");
            // Call original user prompt again after 2 seconds
            setTimeout(productsTable, 2000);
        })
}

// Reads database when user inputs valid query
function readIdOverhead(productId, productPurchase, callback) {
    connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
        if (err) throw err;
        
        // Calculates total charged to customer
        var price = (res[0].price) * productPurchase;
        // Calculates current sales
        var currentSales = (res[0].product_sales)
        
        var newSales = currentSales + price;
        
        callback(newSales, productId)
        
    });
};

// Function to update product quantity on database
function overHead(newSales, ID) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: newSales
            },
            {
                id: ID
            }
        ], function (err, res) {
            if (err) throw err;
        })
}

// Validate if id is a number and an included in the store
function idValidate(input) {
    // Declare function as asynchronous, and save the done callback
    var done = this.async();

    // Do async stuff
    setTimeout(function () {
        if (isNaN(input) || !productIdArray.includes(parseInt(input))) {
            // Pass the return value in the done callback
            done('Invalid ID or not a number entered');
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
        if (isNaN(input) || parseInt(input) < 0) {
            // Pass the return value in the done callback
            done('Positive number not entered');
            return;
        }
        // Pass the return value in the done callback
        done(null, true);
    }, 1000);
}