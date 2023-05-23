// models/Inventory.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Inventory = new Schema({
    itemID: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { collection: "inventory" });

module.exports = mongoose.model("inventory", Inventory);
