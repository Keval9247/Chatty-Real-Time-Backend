const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./db");
const Route = require("./routes/Routes");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  // Add your production frontend URL here, e.g., "https://your-frontend-domain.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies/credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

app.use("/api", Route);

app.get("/test", (req, res) => {
  res.send("API is working...");
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

module.exports = app;