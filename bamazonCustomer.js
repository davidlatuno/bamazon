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

productsTable();

var productIdArray = [];

function productsTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
        for (var i = 0; i < res.length; i++) {
            data.push(Object.values(res[i]));
            productIdArray.push(res[i].id);
        }
        var result = table(data);
        console.log(result);
        intro();
    });
}

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
                var userID = parseInt(input.id);
                var userAmount = parseInt(input.number);
                if (isNaN(userID) || isNaN(userAmount)) {
                    console.log("\nINVALID ID or AMOUNT ENTERED\n");
                    buyID();
                } else {
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

function readID(productId, productPurchase, callback) {
    connection.query("SELECT * FROM products WHERE id=?", [productId], function (err, res) {
        if (err) throw err;
        var currentQuant = res[0].stock_quantity;
        var price = (res[0].price) * productPurchase;
        var newQuant = currentQuant - productPurchase;
        if (newQuant < 0) {
            console.log("\nINSUFFICIENT QUANTITY!\n");
            intro();
        } else {
            callback(newQuant, productId, price);
        }
    });
};

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
            setTimeout(productsTable, 2500);
        })
}