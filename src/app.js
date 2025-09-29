require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");

// 1. Create app
const app = express();
const port = process.env.PORT || 5000;

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. MongoDB connection
// Decide which Mongo URI to use (Docker vs Local)
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`✅ Connected to MongoDB at ${mongoUri}`);
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// 4. API Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));

// 5. Serve static frontend (index.html + app.js from public/)
const publicPath = path.join(__dirname, "..", "public");
console.log("📂 Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Explicitly serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// 6. Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});


