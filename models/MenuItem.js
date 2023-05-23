// models/MenuItem.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuItem = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    itemID: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    inventoryItem: {type: Schema.Types.ObjectId, ref: 'inventory'}, // Added this line
}, {collection:"menuItems"});

module.exports = mongoose.model("menuItems", MenuItem);
