// routers/reportsRouter.js
const express = require("express");
const mongoose = require('mongoose');
const Order = require("../models/Order");
const reportsRouter = express.Router();


// Fetch the total income
reportsRouter.get("/income", async (req, res) => {
    const income = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$totalPrice" } // corrected field name
            }
        }
    ]);
    console.log("income", income);
    const totalIncome = income.length > 0 ? income[0].totalIncome : 0;
    console.log("totalIncome",totalIncome)
    res.json(totalIncome);
});

// Fetch the total income for a specific year
reportsRouter.get("/income/:year", async (req, res) => {
    const year = req.params.year;
    const income = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${Number(year) + 1}-01-01`)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$totalPrice" } // corrected field name
            }
        }
    ]);
    console.log("incomeyear", income);
    res.json(income[0]?.totalIncome || 0);
});

// Fetch the total income for a specific month of a specific year
reportsRouter.get("/income/:year/:month", async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    const income = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-${month}-01`),
                    $lt: month == 12 ? new Date(`${Number(year) + 1}-01-01`) : new Date(`${year}-${Number(month) + 1}-01`)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$totalPrice" } // corrected field name
            }
        }
    ]);
    res.json(income[0]?.totalIncome || 0);
});

// Fetch the total income for a specific day of a specific month of a specific year
reportsRouter.get("/income/:year/:month/:day", async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    const day = req.params.day;
    const income = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-${month}-${day}`),
                    $lt: new Date(`${year}-${month}-${Number(day) + 1}`)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$totalPrice" } // corrected field name
            }
        }
    ]);
    res.json(income[0]?.totalIncome || 0);
});

reportsRouter.get("/most-selling-dish", async (req, res) => {
    const dishes = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.item._id",
                count: { $sum: "$items.quantity" }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },  // Get the top 5 most selling dishes
        {
            $lookup: {
                from: "menuItems",
                localField: "_id",
                foreignField: "_id",
                as: "item"
            }
        },
        { $unwind: "$item" },
        {
          $project: { 
              _id: 0, 
              name: "$item.name", 
              itemID: "$item.itemID",
              description: "$item.description",
              price: "$item.price",
              category: "$item.category",
              image: "$item.image",
              inventoryItem: "$item.inventoryItem",
              count: 1 
          } 
        }
    ]);
    console.log("Most Selling Dishes:", dishes);
    res.json(dishes.length ? dishes : "No dishes sold");
});


// Fetch the most selling dish for a specific user
reportsRouter.get("/most-selling-dish/user/:email", async (req, res) => {
    const email = req.params.email;
    console.log("Email:", email); // Log the email parameter
    const mostSellingDish = await Order.aggregate([
      { $match: { "user.email": email } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item._id",
          count: { $sum: "$items.quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "menuItems",
          localField: "_id",
          foreignField: "_id",
          as: "item"
        }
      },
      { $unwind: "$item" },
      {  $project: { 
        _id: "item._id", 
        name: "$item.name", 
        itemID: "$item.itemID",
        description: "$item.description",
        price: "$item.price",
        category: "$item.category",
        image: "$item.image",
        inventoryItem: "$item.inventoryItem",
        count: 1 
         } 
    }
    ]);
    console.log("most:",mostSellingDish);
    res.json(mostSellingDish);
  });
  // Fetch the total income by meal
reportsRouter.get("/income-by-meal", async (req, res) => {
    const incomeByMeal = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.item.name",
                totalIncome: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
            }
        },
        { $sort: { totalIncome: -1 } },
        {
            $project: {
                _id: 0,
                meal: "$_id",
                totalIncome: "$totalIncome"
            }
        }
    ]);

    console.log("Income by meal:", incomeByMeal);
    res.json(incomeByMeal);
});

  


module.exports = reportsRouter;
