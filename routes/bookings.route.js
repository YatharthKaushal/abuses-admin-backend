import express from "express";
import {
  createBooking,
  getBooking,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/bookings.controller.js"; // Assuming controller is in controllers/bookingController.js

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get a specific booking by ID
router.get("/:id", getBooking);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

// Get all bookings
router.get("/", getAllBookings);

export default router;

// import express from "express";

// const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Bookings route");
// });

// export default router;
