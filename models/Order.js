const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];
const DELIVERY_STATUSES = ['Pending', 'Shipped', 'Delivered'];

const OrderSchema = new Schema({
  orderId: { type: Number },
  user: {
    _id: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User ID is required'] },
    name: { type: String, required: [true, 'User name is required'] },
    email: { type: String, required: [true, 'User email is required'] },
    phone: { type: String, required: [true, 'User phone number is required'] }
  },
  items: [
    {
      item: {
        _id: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: [true, 'Item ID is required'] },
        itemID: { type: String, required: [true, 'Item ID is required'] },
        name: { type: String, required: [true, 'Item name is required'] },
        price: { type: Number, required: [true, 'Item price is required'] },
        category: { type: String, required: [true, 'Item category is required'] },
        description: { type: String, required: [true, 'Item description is required'] },
        quantity: { type: Number, required: [true, 'Item quantity is required'] },
        image: { type: String, required: [true, 'Item image URL is required'] }
      },
      quantity: { type: Number, required: [true, 'Quantity is required'] },
      price: { type: Number, required: [true, 'Price is required'] }
    }
  ],
  totalPrice: { type: Number, required: [true, 'Total is required'] },
  status: { type: String, default: 'Pending', enum: STATUSES },
  payment: {
    method: { type: String, required: [true, 'Payment method is required'] },
    transactionId: { type: String, required: [true, 'Transaction ID is required'] },
    status: { type: String, default: 'Pending', enum: PAYMENT_STATUSES },
  },
  delivery: {
    address: { type: String, required: [true, 'Delivery address is required'] },
    status: { type: String, default: 'Pending', enum: DELIVERY_STATUSES },
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: "orders", timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
