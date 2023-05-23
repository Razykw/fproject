// routers/inventoryRouter.js
const express = require("express");
const Inventory = require("../models/Inventory");
const inventoryRouter = express.Router();

// Fetch all inventory items
inventoryRouter.get("/", async (req, res) => {
    const inventory = await Inventory.find({});
    res.json(inventory);
});
inventoryRouter.put("/:inventoryId/quantity", async (req, res) => {
    try {
      const inventoryId = req.params.inventoryId;
      const decreaseQuantity = req.body.quantity;  // The quantity to decrease
      const inventoryItem = await Inventory.findById(inventoryId);
      if (!inventoryItem) {
        throw new Error('Inventory item not found');
      }
      inventoryItem.quantity -= decreaseQuantity;  // Decrease the inventory quantity
      await inventoryItem.save();
      res.json(inventoryItem);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// Add a new inventory item
inventoryRouter.post("/", async (req, res) => {
    try {
        const newInventoryItem = new Inventory(req.body);
        await newInventoryItem.save();
        res.json(newInventoryItem);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch a specific inventory item
inventoryRouter.get("/:inventoryId", async (req, res) => {
    const inventoryId = req.params.inventoryId;
    const inventoryItem = await Inventory.findById(inventoryId);
    if (!inventoryItem) {
        res.status(404).json({ message: "Inventory item not found" });
    } else {
        res.json(inventoryItem);
    }
});

// Update an inventory item
inventoryRouter.put("/:inventoryId", async (req, res) => {
    try {
        const inventoryId = req.params.inventoryId;
        const updatedInventoryItem = req.body;
        const result = await Inventory.findByIdAndUpdate(inventoryId, updatedInventoryItem, { new: true });
        if (!result) {
            throw new Error('Inventory item not found');
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete an inventory item
inventoryRouter.delete("/:inventoryId", async (req, res) => {
    try {
        const inventoryId = req.params.inventoryId;
        const result = await Inventory.findByIdAndRemove(inventoryId);
        if (!result) {
            throw new Error('Inventory item not found');
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = inventoryRouter;
