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

// Holds products id
var productIdArray = [];

function manager() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "action"
            }
        ])
        .then(function (res) {
            switch (res.action) {

                case "View Products":
                    productsTable("View Products");
                    break;

                case "View Low Inventory":
                    lowTable();
                    break;

                case "Add to Inventory":
                    productsTable();
                    break;
                
                case "Exit":
                    connection.end();
                    break;
            }
        })
};

manager();

// Logs products to terminal using table npm package
function productsTable(pass) {
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
        if (pass === "View Products") {
            manager();  
        } else {
            inquireInventory();
        }
        
    })
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
        manager();
    });
}

function inquireInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the item you would like to add inventory to?",
                name: "id"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
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
                inquireInventory();
            } else {
                var userID = parseInt(input.id);
                var userAmount = parseInt(input.number);

                // User validation for NaN
                if (isNaN(userID) || isNaN(userAmount)) {
                    console.log("\nINVALID ID or AMOUNT ENTERED\n");
                    inquireInventory();
                } else {
                    // Second level of user validation for correct id numbers and positive purchase amoutns
                    if (productIdArray.includes(userID) && userAmount > 0) {
                        readID(input.id, input.number, addInventory);
                    } else {
                        console.log("\nITEM DOES NOT EXIST or INVALID PRODUCT AMOUNT\n");
                        inquireInventory();
                    }
                }
            }
        })
}

// Reads database when user inputs valid query
function readID(productId, addQuantity, callback) {
    connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
        if (err) throw err;
        // Holds the current quantity of item chosen
        var currentQuant = res[0].stock_quantity;

        // Calculates new product quantity
        var newQuant = currentQuant + parseInt(addQuantity);

        // Calls addInventory function
        callback(newQuant, productId);
    });
};

// Add inventory to specific item
function addInventory(number, productId) {
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: number
        },
        {
            id: productId
        }
    ],
        function (err, res) {
            console.log("\nPRODUCT UPDATED!\n");
            manager();
        })
};

// Function that adds item to database
function addProduct(name, department, price, quantity) {
    connection.query("INSERT INTO products SET ?", {
        product_name: name,
        department_name: department,
        price: price,
        stock_quantity: quantity
    }, function (err, res) {
        console.log("\nPRODUCT SUCCESSFULLY ADDED!\n");
        manager();
    })
};