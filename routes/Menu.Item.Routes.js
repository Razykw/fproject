const express = require("express");
const MenuItem = require("../models/MenuItem");
const menuItemsRouter = express.Router();

// Fetch all menu items
menuItemsRouter.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new menu item
menuItemsRouter.post("/", async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch a specific menu item
menuItemsRouter.get("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await MenuItem.findById(itemId);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
    } else {
      res.json(item);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a menu item
menuItemsRouter.put("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedItem = req.body;
    const result = await MenuItem.findByIdAndUpdate(itemId, updatedItem, { new: true });
    if (!result) {
      throw new Error('Item not found');
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a menu item
menuItemsRouter.delete("/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const result = await MenuItem.findByIdAndRemove(itemId);
    if (!result) {
      throw new Error('Item not found');
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = menuItemsRouter;
