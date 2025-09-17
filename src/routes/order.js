const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

/**
 * POST /api/orders/checkout
 * - Works for guests (no login required)
 * - If logged in, ties order to userId
 */
router.post('/checkout', async (req, res) => {
  try {
    let userId = null;

    // If token exists and is valid, attach userId
    if (req.headers.authorization) {
      try {
        await new Promise((resolve, reject) => {
          verifyToken(req, res, (err) => {
            if (!err && req.user) {
              userId = req.user._id || req.user.id;
            }
            resolve();
          });
        });
      } catch {
        // ignore if invalid/expired token → guest checkout
      }
    }

    // If user logged in → find their cart, else just simulate guest checkout
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else {
      cart = await Cart.findOne().populate('items.product'); // fallback guest cart
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Compute total price
    const totalPrice = cart.items.reduce(
      (sum, it) => sum + (it.product.price || 0) * it.quantity,
      0
    );

    const order = new Order({
      user: userId, // null if guest
      items: cart.items.map(it => ({
        product: it.product._id,
        quantity: it.quantity
      })),
      totalPrice
    });

    await order.save();

    // If it was a logged-in user, clear their cart
    if (userId) {
      await Cart.deleteOne({ _id: cart._id });
    }

    const populated = await order.populate('items.product');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/orders
 * - Only logged in users can see their own orders
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
