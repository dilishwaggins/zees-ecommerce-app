const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// POST /api/orders/checkout
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const userId = req.user._1d || req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // compute total
    const totalPrice = cart.items.reduce((sum, it) => sum + (it.product.price || 0) * it.quantity, 0);

    const order = new Order({
      user: userId,
      items: cart.items.map(it => ({ product: it.product._id, quantity: it.quantity })),
      totalPrice
    });

    await order.save();
    await Cart.deleteOne({ _id: cart._id }); // clear cart
    const populated = await order.populate('items.product');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/orders  -> user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
