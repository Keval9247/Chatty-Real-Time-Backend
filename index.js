const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./db");
const Route = require("./routes/Routes");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  process.env.APP_LOCAL_URL || "http://localhost:5173", // From .env
  // Add production frontend URL here, e.g., "https://your-frontend-domain.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman) or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`); // Debug log
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow Authorization
  credentials: true, // Allow cookies/credentials
  optionsSuccessStatus: 200, // Ensure preflight returns 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Routes
app.use("/api", Route);

app.get("/test", (req, res) => {
  res.send("API is working...");
});

// Database connection
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Start server (for local testing, Render.com will override this)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;