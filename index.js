const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const users = require("./routes/users.route");
const menuItems = require("./routes/Menu.Item.Routes");
const orders = require("./routes/Order.Routes");
const inventory = require("./routes/Inventory.Routes");
const staff = require("./routes/Staff.Routes");
const reviews = require("./routes/Review.Routes");
const reports = require("./routes/reportsRouter");
const cart = require("./routes/cartRouter"); // Add this line

const app = express();
const PORT = 8000;
const mongDB = "mongodb://127.0.0.1:27017/fp";

mongoose.connect(mongDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.error('Connection error', err));

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use routes
app.use("/users", users);
app.use("/menuItems", menuItems);
app.use("/orders", orders);
app.use("/inventory", inventory);
app.use("/staff", staff);
app.use("/reviews", reviews);
app.use("/reports", reports);
app.use("/cart", cart); // Add this line

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
