// models/MenuItem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Inventory = require("./Inventory");  // Add this line to import Inventory model

const MenuItem = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    itemID: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    inventoryItem: {type: Schema.Types.ObjectId, ref: 'inventory'}, 
}, {collection:"menuItems"});

MenuItem.pre('save', function(next) {
  // "this" refers to the MenuItem instance
  const menuItem = this;

  // Create a new inventory item
  const inventoryItem = new Inventory({
    itemID: menuItem.itemID, 
    itemName: menuItem.name,
    quantity: 0, // Default quantity
  });

  // Save the inventory item
  inventoryItem.save()
    .then((savedInventoryItem) => {
      // Reference the inventory item from the menu item
      menuItem.inventoryItem = savedInventoryItem._id;
      next();
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = mongoose.model("menuItems", MenuItem);
