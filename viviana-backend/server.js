// viviana-backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");



dotenv.config();

const app = express();
app.use(express.json()); // 👈 This parses incoming JSON body

// Configure CORS with environment-specific origins
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL, process.env.ADMIN_URL]
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../viviana-frontend/dist")));

// Serve admin static files
app.use("/admin", express.static(path.join(__dirname, "../viviana-admin/dist")));

// Handle frontend routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../viviana-frontend/dist/index.html"));
});

// Handle admin routes
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../viviana-admin/dist/index.html"));
});

// ✅ Mount routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes); // <-- this line is important
//  auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

