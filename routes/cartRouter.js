const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get user's cart
router.get('/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;

  try {
    const cart = await Cart.findOne({ userEmail }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/:userEmail', async (req, res) => {
  console.log(req)
  const userEmail = req.params.userEmail;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userEmail });

    if (cart) {
      // Update existing cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart = await cart.save();
      res.json(cart);
    } else {
      // Create new cart
      const newCart = new Cart({ userEmail, items: [{ productId, quantity }] });
      cart = await newCart.save();
      res.json(cart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:userEmail/:itemId', async (req, res) => {
  const userEmail = req.params.userEmail;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ userEmail });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );
    await cart.save();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Update item in cart
router.put('/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const updatedItem = req.body;

  try {
    const cart = await Cart.findOne({ 'items._id': itemId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Assuming updatedItem contains the updated quantity and ingredients
    item.quantity = updatedItem.quantity;
    item.productId.ingredients = updatedItem.ingredients;

    await cart.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
