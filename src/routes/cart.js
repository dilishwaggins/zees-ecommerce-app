const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // adjust case if your file is Product.js
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// GET /api/cart   -> user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart || { user: userId, items: [] });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/cart/add  -> add item
router.post('/add', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: 'productId and quantity required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const found = cart.items.find(i => i.product.toString() === productId);
    if (found) found.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity: Number(quantity) });

    await cart.save();
    const populated = await cart.populate('items.product');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
