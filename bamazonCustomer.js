var mysql = require("mysql");
var {table} = require("table");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    data = [["ID", "NAME", "DEPARMENT", "PRICE", "QUANTITY"]];
    for (var i = 0; i < res.length; i++) {
        data.push(Object.values(res[i]));
    }
    var result = table(data);
    console.log(result);
})