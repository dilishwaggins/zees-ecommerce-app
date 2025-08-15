require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Home route
app.get("/", (req, res) => {
  res.send("Hello Zee's E-Commerce App!");
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const productRoutes = require('./routes/product');
app.use('/api', productRoutes);


// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
