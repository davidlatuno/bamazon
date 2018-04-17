# bamazon

**INDEX**
* [OVERVIEW](https://github.com/davidlatuno/bamazon#overview)
* [NPM MODULES](https://github.com/davidlatuno/bamazon#npm-modules)
* [RUNNING THE PROGRAM](https://github.com/davidlatuno/bamazon#running-the-program)
* [EXAMPLE VIDEOS](https://github.com/davidlatuno/bamazon#example-vidoes)


## Overview
Amazon-like store front using a CLI, node.js, and mySQL

**Customer View:**
1. See available products for sale
2. Make a purchase if item has enough stock

**Manager View:**
1. View current products for sale
2. View low inventory
3. Add inventory to specific items
4. Add new products
5. Delete products


## npm modules

* inquirer
* mysql
* table

Once you have the package.json file in your folder, just run the following in your terminal to install the above dependencies:

```
npm i
```

**hint: dont forget to cd into the folder you cloned the repo into before running any terminal commands**


## Running the program

There are two versions of bamazon: the customer and the manager. After running the below terminal command you can follow the prompts to access the respective functions.

In you terminal, you can run either:

```
node bamazonCustomer.js

node bamazonManager.js
```

**hint: dont forget to cd into the folder you cloned the repo into before running any terminal commands**


## Example Vidoes

Customer Buying Product

[![customer](http://img.youtube.com/vi/ZKhhUs0DFoE/0.jpg)](http://www.youtube.com/watch?v=ZKhhUs0DFoE "Bamazon Customer")

Manger Viewing Products and Low Inventory:

[![manager1](http://img.youtube.com/vi/iSu6DDYth_4/0.jpg)](http://www.youtube.com/watch?v=iSu6DDYth_4 "Manager Video 1")

Manger Adding Inventory and View Low Inventory when non exists:

[![manager2](http://img.youtube.com/vi/ChUseczs04Y/0.jpg)](http://www.youtube.com/watch?v=ChUseczs04Y "Manager Video 2")


Manger Adding Product:

[![manager3](http://img.youtube.com/vi/bkD4Ht1QjG8/0.jpg)](http://www.youtube.com/watch?v=bkD4Ht1QjG8 "Manager Video 3")


Manger Deleting Product:

[![manager4](http://img.youtube.com/vi/PAZuZrmlzNY/0.jpg)](http://www.youtube.com/watch?v=PAZuZrmlzNY "Manager Video 4")

Validation Examples for Customer view (manager validations used are very similar):

[![validation](http://img.youtube.com/vi/YZ1dUW4pGm0/0.jpg)](http://www.youtube.com/watch?v=YZ1dUW4pGm0 "Customer Validation")
