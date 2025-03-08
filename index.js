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
    const allowedOrigins = [
      "http://localhost:5173", // Development frontend
      // Add your production frontend URL here
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

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

const PORT = process.env.PORT || 3000; // Render.com will override this
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1); // Exit with failure
});

module.exports = app;