require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Product = require("./models/Product");
console.log("MONGO_URI from env:", process.env.MONGO_URI);

const products = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with USB receiver",
    price: 15.99,
    category: "Electronics",
    stock: 100,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches",
    price: 49.99,
    category: "Electronics",
    stock: 50,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation",
    price: 89.99,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Smartwatch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 59.99,
    category: "Wearables",
    stock: 70,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Backpack",
    description: "Durable waterproof laptop backpack",
    price: 39.99,
    category: "Accessories",
    stock: 120,
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug with heat-sensitive color change",
    price: 12.99,
    category: "Kitchen",
    stock: 200,
    imageUrl: "https://via.placeholder.com/150"
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ Connected to MongoDB");
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("🌱 Seeded database with products");
  process.exit();
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});
