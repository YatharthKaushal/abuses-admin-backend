import mongoose from "mongoose";
import Booking from "../models/Booking.js"; // Assuming the schema file is in models/Booking.js
import User from "../models/User.js"; // Assuming User model exists
import { v4 as uuidv4 } from "uuid";
import Consumer from "../models/Consumer.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { customer, vehicle, trip, payment } = req.body;

    // Validate required fields
    // if (
    //   !customer ||
    //   !customer.name ||
    //   !customer.phone ||
    //   !customer.email ||
    //   !vehicle ||
    //   !vehicle.vehicleId ||
    //   !vehicle.type ||
    //   !vehicle.number ||
    //   !vehicle.driver ||
    //   !trip ||
    //   !trip.from ||
    //   !trip.to ||
    //   !trip.startDate ||
    //   !trip.endDate ||
    //   !trip.totalDays ||
    //   !trip.purpose ||
    //   !payment ||
    //   !payment.total
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "All required fields must be provided" });
    // }

    // Check if user exists or create new user
    let consumer = await Consumer.findOne({ phone: customer.phone });
    if (!consumer) {
      consumer = await Consumer.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    }

    // Generate unique booking number
    const bookingNumber = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create new booking
    const newBooking = new Booking({
      bookingNumber,
      customer: {
        consumerId: consumer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
      vehicle,
      trip,
      payment,
      status: "pending",
      timeline: [
        {
          action: "Booking created",
          consumer: consumer.name,
          time: new Date(),
        },
      ],
    });

    // Save booking
    const savedBooking = await newBooking.save();

    // Populate references
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("customer.consumerId", "name email")
      .populate("vehicle.vehicleId", "type number");

    return res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get booking by ID
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer.consumerId", "name email")
      .populate("vehicle.vehicleId", "type number");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "rejected", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    booking.timeline.push({
      action: `Status updated to ${status}`,
      consumer: req.consumer?.name || "System", // Assuming user info is available in req.user
      time: new Date(),
    });

    const updatedBooking = await booking.save();

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer.consumerId", "name email")
      .populate("vehicle.vehicleId", "type number")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update an existing booking
export const updateBooking = async (req, res) => {
  try {
    const { customer, vehicle, trip, payment } = req.body;
    const bookingId = req.params.id;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update consumer if necessary
    let consumer = await Consumer.findOne({ phone: customer.phone });
    if (!consumer) {
      consumer = await Consumer.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    }

    // Update booking fields
    booking.customer = {
      consumerId: consumer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    };
    booking.vehicle = vehicle;
    booking.trip = trip;
    booking.payment = payment;
    booking.timeline.push({
      action: "Booking updated",
      user: consumer.name || "System",
      time: new Date(),
    });

    // Save updated booking
    const updatedBooking = await booking.save();

    // Populate references
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate("customer.consumerId", "name email")
      .populate("vehicle.vehicleId", "type number");

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
