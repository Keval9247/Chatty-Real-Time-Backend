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

const corsOptions = {
  origin: true, // Update to your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include all methods you need
  allowedHeaders: ["Content-Type", "Authorization"], // Match frontend headers
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