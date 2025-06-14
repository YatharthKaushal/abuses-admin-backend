import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/database.js";
import config from "./configs/config.js";

import bookingRoute from "./routes/bookings.route.js";
import vehicleRoute from "./routes/vehicles.route.js";
import consumerRoute from "./routes/consumer.route.js";
import teamMembers from "./routes/teamMember.route.js";

dotenv.config();

const app = express();

// config cors polisy from config.js
app.use(
  cors({
    origin: config.CORS_ORIGIN, // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials if needed
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default test routes
app.get("/", (req, res) => {
  res.send(`Welcome to the Scheduling API! Environment: ${config.NODE_ENV}`);
});

// ap.use() api routes
app.use("/api/bookings", bookingRoute);
app.use("/api/vehicles", vehicleRoute);
app.use("/api/consumers", consumerRoute);
app.use("/api/team", teamMembers);

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error("? Something broke!", err.stack);
  res.status(500).send("? Something broke!");
});
// Start the server
app.listen(config.PORT, () => {
  console.log(
    `> Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
  console.log(`> Access the API at http://localhost:${config.PORT}`);
});
