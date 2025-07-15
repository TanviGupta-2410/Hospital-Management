const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});