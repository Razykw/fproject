// models/Staff.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Staff = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
}, { collection: "staff" });

module.exports = mongoose.model("staff", Staff);
