import Consumer from "../models/Consumer.js";

// @desc    Create a new consumer
// @route   POST /api/consumers
// @access  Public (or Private, depending on your auth strategy)
export const createConsumer = async (req, res) => {
  try {
    const { name, phone, email, address, company, type } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required fields." });
    }

    // Check if a consumer with the given phone already exists
    const existingConsumer = await Consumer.findOne({ phone });
    if (existingConsumer) {
      return res
        .status(409)
        .json({ message: "A consumer with this phone number already exists." });
    }

    const newConsumer = new Consumer({
      name,
      phone,
      email,
      address,
      company,
      type,
    });

    const savedConsumer = await newConsumer.save();
    res.status(201).json(savedConsumer); // 201 Created
  } catch (error) {
    console.error("Error creating consumer:", error);
    if (error.code === 11000) {
      // Duplicate key error (for unique fields like email if enabled)
      return res.status(409).json({
        message: "Duplicate key error. Check unique fields like phone/email.",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all consumers
// @route   GET /api/consumers
// @access  Public
export const getAllConsumers = async (req, res) => {
  try {
    const consumers = await Consumer.find({});
    res.status(200).json(consumers);
  } catch (error) {
    console.error("Error fetching all consumers:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a single consumer by ID
// @route   GET /api/consumers/:id
// @access  Public
export const getConsumerById = async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.params.id);
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found." }); // 404 Not Found
    }
    res.status(200).json(consumer);
  } catch (error) {
    console.error("Error fetching consumer by ID:", error);
    // Handle invalid Mongoose ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid consumer ID format." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a consumer by ID
// @route   PUT /api/consumers/:id
// @access  Public
export const updateConsumer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, company, type } = req.body;

    // Find and update the consumer
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validators on update
    const updatedConsumer = await Consumer.findByIdAndUpdate(
      id,
      { name, phone, email, address, company, type },
      { new: true, runValidators: true }
    );

    if (!updatedConsumer) {
      return res.status(404).json({ message: "Consumer not found." });
    }

    res.status(200).json(updatedConsumer);
  } catch (error) {
    console.error("Error updating consumer:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid consumer ID format." });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Duplicate phone number. This phone is already in use by another consumer.",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a consumer by ID
// @route   DELETE /api/consumers/:id
// @access  Public
export const deleteConsumer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedConsumer = await Consumer.findByIdAndDelete(id);

    if (!deletedConsumer) {
      return res.status(404).json({ message: "Consumer not found." });
    }

    res.status(200).json({ message: "Consumer deleted successfully." }); // 200 OK
  } catch (error) {
    console.error("Error deleting consumer:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid consumer ID format." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
