CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments(
	id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	department_name VARCHAR(100) NOT NULL,
	over_head_costs DECIMAL(10, 2) NOT NULL
);

INSERT INTO departments (department_name, over_head_costs) VALUES ("Games", 10000), ("Electronics", 20000);

CREATE TABLE products(
	id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock_quantity INTEGER(10),
	product_sales DECIMAL(10, 2) NOT NULL DEFAULT 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dishonored", "Games", "20.00", 100), ("Skyrim", "Games", "20.00", 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PS4", "Electronics", "400.00", 100), ("Nintendo Switch", "Electronics", "300.00", 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Outliers", "Books", "20.00", 100), ("Beer", "Books", "20.00", 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Basketball", "Sports", "10.00", 100), ("Boxing Gloves", "Sports", "30.00", 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Princess Mononoke", "Movies", "20.00", 100), ("Wanted", "Movies", "10.00", 100);

SELECT * FROM products;

SELECT * FROM departments;

SELECT department_name, SUM(product_sales) AS "Total Sales" FROM products GROUP BY department_name;

SELECT departments.id, departments.department_name, departments.over_head_costs, IF(SUM(products.product_sales) is NULL, 0.00, SUM(products.product_sales)) AS "Total Sales", IF(SUM(products.product_sales) is NULL, 0.00 - departments.over_head_costs, 0.00 - departments.over_head_costs) AS "Total Profit" FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY departments.id;
