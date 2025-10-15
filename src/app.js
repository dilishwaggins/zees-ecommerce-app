const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const client = require("prom-client");

// ------------------------------
// 🔹 Initialize Express App
// ------------------------------
const app = express();
const port = process.env.PORT || 5000;

// ------------------------------
// 🔹 Prometheus Metrics Setup
// ------------------------------
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Middleware to count all requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint (for Prometheus)
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Health check endpoint (for Docker + uptime monitoring)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ------------------------------
// 🔹 Middlewares
// ------------------------------
app.use(cors());
app.use(express.json());

// ------------------------------
// 🔹 MongoDB Connection
// ------------------------------
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ Connected to MongoDB at ${mongoUri}`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------
// 🔹 API Routes
// ------------------------------
app.use("/api", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));

// ------------------------------
// 🔹 Serve Static Frontend
// ------------------------------
const publicPath = path.join(__dirname, "..", "public");
console.log("📂 Serving static files from:", publicPath);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ------------------------------
// 🔹 Start Server
// ------------------------------
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
});
