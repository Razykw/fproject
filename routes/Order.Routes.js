const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Inventory = require("../models/Inventory");
const User = require("../models/User");
const { ObjectId } = mongoose.Types;

const ordersRouter = express.Router();

// Fetch all orders
ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user items");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Create a new order
ordersRouter.post("/", async (req, res) => {
  // console.log(req.body);  // Added this line
  try {
    const {
      orderId,
      user,
      items,
      totalPrice,
      status,
      payment,
      delivery,
      notes,
    } = req.body;
    console.log(req.body);  // Added this line

    // console.log("User:", user);
    // console.log("Items:", items);
    // console.log("orderId:", orderId);
    // console.log("totalPrice:", totalPrice);
    // console.log('payment:', payment);
    // console.log('delivery:', delivery);
    // console.log('status:', status);
    // console.log('notes:', notes);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items not provided or invalid format" });
    }

    const userEntity = await User.findOne({ email: user.email });
    console.log("userEntityID:",userEntity._id);

    if (!userEntity) {
      return res.status(400).json({ message: "User not found" });
    }

    const orderItems = [];

    for (let orderItem of items) {
      console.log("Looking for item with _id:", orderItem.item._id);
      const menuItem = await MenuItem.findById(orderItem.item._id);
      console.log("Looking for item with _id:", menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: "Invalid menu item: " + orderItem.item._id });
      }
      orderItems.push({
        item: {
          _id: menuItem._id,
          itemID: menuItem.itemID,
          name: menuItem.name,
          price: menuItem.price,
          category: menuItem.category,
          description: menuItem.description,
          quantity: orderItem.quantity, // assuming this is the quantity ordered, not quantity available
          image: menuItem.image,
          ingredients: orderItem.item.ingredients
        },
        quantity: orderItem.quantity,
        price: orderItem.price,
      });
    }

    const newOrder = new Order({
      orderId: orderId,
      user: {
        _id: userEntity._id,
        name: userEntity.name,
        email: userEntity.email,
        phone: userEntity.phone
      },
      items: orderItems,
      totalPrice: totalPrice,
      status: status,
      payment: {
        method: payment.method,
        transactionId: payment.transactionId,
        status: payment.status
      },
      delivery: {
        address: delivery.address,
        status: delivery.status
      },
      notes: notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("New Order:", newOrder);

    for (const orderItem of newOrder.items) {
      const inventoryItem = await Inventory.findOne({ itemID: orderItem.item.itemID });
      console.log("inventory item:",orderItem.item.itemID)
      if (!inventoryItem || inventoryItem.quantity < orderItem.quantity) {
        return res.status(400).json({
          message:
            "Insufficient inventory for item: " + orderItem.item.toString(),
        });
      }
      inventoryItem.quantity -= orderItem.quantity;
      await inventoryItem.save();
    }

    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message });

  }
});


// Fetch a specific order
ordersRouter.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate("user items");
    if (!order) {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.json(order);
    }
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update an order
ordersRouter.put("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedOrder = req.body;
    const result = await Order.findByIdAndUpdate(orderId, updatedOrder, {
      new: true,
    }).populate("user items");
    if (!result) {
      throw new Error("Order not found");
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch orders based on user role
ordersRouter.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email; // Get the email parameter from the request
    const orders = await Order.find({ "user.email": email }); // Query orders using the email
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});




// Delete an order
ordersRouter.delete("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await Order.findByIdAndRemove(orderId);
    if (!result) {
      throw new Error("Order not found");
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = ordersRouter;
