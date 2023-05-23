// models/Review.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'menuItems', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
}, { collection: "reviews", timestamps: true });

module.exports = mongoose.model("reviews", Review);
