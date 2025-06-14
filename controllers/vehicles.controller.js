import Vehicle from "../models/Vehicle.js"; // Assuming your model is in vehicle.model.js
import mongoose from "mongoose";

/**
 * @description Create a new vehicle
 * @route POST /api/vehicles
 * @access Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const createVehicle = async (req, res) => {
  console.log("> reached:", req.body);
  try {
    // Check if a vehicle with the same number already exists
    const existingVehicle = await Vehicle.findOne({ number: req.body.number });
    if (existingVehicle) {
      // console.log("> A vehicle with this number already exists.");
      return res
        .status(400)
        .json({ message: "A vehicle with this number already exists." });
    }

    const vehicle = new Vehicle(req.body);
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    // console.log("> Error creating vehicle", error.message);
    res
      .status(400)
      .json({ message: "Error creating vehicle", error: error.message });
  }
};

/**
 * @description Create multiple new vehicles from an array
 * @route POST /api/vehicles/many
 * @access Private/Admin
 * @param {object} req - Express request object with a body containing an array of vehicles
 * @param {object} res - Express response object
 */
export const createManyVehicles = async (req, res) => {
  try {
    const vehiclesData = req.body;

    // 1. Validate input: Ensure the body is a non-empty array
    if (!Array.isArray(vehiclesData) || vehiclesData.length === 0) {
      return res
        .status(400)
        .json({
          message: "Request body must be a non-empty array of vehicle objects.",
        });
    }

    // 2. Extract all incoming vehicle numbers for an efficient DB check
    const incomingNumbers = vehiclesData.map((v) => v.number);

    // 3. Find all vehicles that already exist with any of the incoming numbers
    const existingVehicles = await Vehicle.find({
      number: { $in: incomingNumbers },
    });
    const existingNumbersSet = new Set(existingVehicles.map((v) => v.number));

    // 4. Separate new vehicles from ones that are duplicates (either in DB or in the request itself)
    const newVehiclesToCreate = [];
    const skippedVehicles = [];
    const processedNumbers = new Set(); // Tracks numbers within the incoming array to avoid duplicates

    for (const vehicle of vehiclesData) {
      if (!vehicle.number) {
        skippedVehicles.push({
          data: vehicle,
          reason: "Missing vehicle number.",
        });
        continue;
      }

      if (existingNumbersSet.has(vehicle.number)) {
        skippedVehicles.push({
          number: vehicle.number,
          reason: "A vehicle with this number already exists in the database.",
        });
      } else if (processedNumbers.has(vehicle.number)) {
        skippedVehicles.push({
          number: vehicle.number,
          reason: "Duplicate vehicle number found within the request list.",
        });
      } else {
        newVehiclesToCreate.push(vehicle);
        processedNumbers.add(vehicle.number);
      }
    }

    // 5. If there are no new vehicles to add, return a summary
    if (newVehiclesToCreate.length === 0) {
      return res.status(200).json({
        message: "No new vehicles were created.",
        createdCount: 0,
        skippedCount: skippedVehicles.length,
        skippedVehicles: skippedVehicles,
      });
    }

    // 6. Insert all new vehicles in a single, efficient database operation
    const createdVehicles = await Vehicle.insertMany(newVehiclesToCreate);

    // 7. Respond with a detailed summary of the operation
    res.status(201).json({
      message: `Operation complete. Successfully created ${createdVehicles.length} vehicles.`,
      createdCount: createdVehicles.length,
      skippedCount: skippedVehicles.length,
      createdVehicles,
      skippedVehicles,
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred while creating vehicles.",
      error: error.message,
    });
  }
};

/**
 * @description Get a single vehicle by its MongoDB ID
 * @route GET /api/vehicles/:id
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID format." });
    }

    const vehicle = await Vehicle.findById(id).populate("vendor.vendorId");
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vehicle", error: error.message });
  }
};

/**
 * @description Get a single vehicle by its registration number
 * @route GET /api/vehicles/number/:number
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getVehicleByNumber = async (req, res) => {
  try {
    const { number } = req.params;
    const vehicle = await Vehicle.findOne({
      number: number.toUpperCase(),
    }).populate("vendor.vendorId");
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: `Vehicle with number ${number} not found` });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vehicle", error: error.message });
  }
};

/**
 * @description Get all vehicles with filtering and pagination
 * @route GET /api/vehicles
 * @access Public
 * @param {object} req - Express request object with query params
 * @param {object} res - Express response object
 * @query_params
 * - page: for pagination
 * - limit: for pagination
 * - type: filter by vehicle type (bus, car, etc.)
 * - status: filter by status (available, booked, etc.)
 * - ownership: filter by ownership (own, vendor)
 */
export const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, ownership } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (ownership) query.ownership = ownership;

    const vehicles = await Vehicle.find(query)
      // .limit(limit * 1)
      // .skip((page - 1) * limit)
      .populate("vendor.vendorId")
      .exec();

    const count = await Vehicle.countDocuments(query);

    res.status(200).json({
      vehicles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalVehicles: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all vehicles", error: error.message });
  }
};

/**
 * @description Update a vehicle by its ID or registration number
 * @route PUT /api/vehicles/:identifier
 * @access Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const updateVehicle = async (req, res) => {
  try {
    const { identifier } = req.params;
    const updateData = req.body;

    let query;
    // Check if the identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      // Otherwise, assume it's a vehicle number
      query = { number: identifier.toUpperCase() };
    }

    // Prevent changing the unique vehicle number to one that already exists
    if (updateData.number) {
      const existingVehicle = await Vehicle.findOne({
        number: updateData.number,
        _id: { $ne: (await Vehicle.findOne(query))?._id },
      });
      if (existingVehicle) {
        return res.status(400).json({
          message: "Another vehicle with this number already exists.",
        });
      }
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(query, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    }).populate("vendor.vendorId");

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found to update." });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating vehicle", error: error.message });
  }
};

/**
 * @description Delete a vehicle by its ID
 * @route DELETE /api/vehicles/:id
 * @access Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID format." });
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found to delete." });
    }

    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting vehicle", error: error.message });
  }
};

/**
 * @description Get compliance documents nearing expiry
 * @route GET /api/vehicles/compliance/nearing-expiry
 * @access Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getComplianceNearingExpiry = async (req, res) => {
  try {
    const { days = 30 } = req.query; // Default to 30 days
    const expiryDateThreshold = new Date();
    expiryDateThreshold.setDate(expiryDateThreshold.getDate() + parseInt(days));

    const query = {
      $or: [
        { "compliance.rcExpiry": { $lte: expiryDateThreshold } },
        { "compliance.insurance.expiry": { $lte: expiryDateThreshold } },
        { "compliance.fitnessExpiry": { $lte: expiryDateThreshold } },
        { "compliance.permit.expiry": { $lte: expiryDateThreshold } },
        { "compliance.pocExpiry": { $lte: expiryDateThreshold } },
      ],
    };

    const expiringVehicles = await Vehicle.find(query).select(
      "number model compliance.rcExpiry compliance.insurance compliance.fitnessExpiry compliance.permit compliance.pocExpiry"
    );

    if (expiringVehicles.length === 0) {
      return res.status(200).json({
        message: `No vehicle compliance documents expiring within the next ${days} days.`,
      });
    }

    res.status(200).json(expiringVehicles);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching compliance expiry data",
      error: error.message,
    });
  }
};

/**
 * @description Get overall fleet statistics
 * @route GET /api/vehicles/stats/overall
 * @access Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getFleetStats = async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          totalTrips: { $sum: "$stats.totalTrips" },
          totalKms: { $sum: "$stats.totalKms" },
          totalRevenue: { $sum: "$stats.revenue" },
        },
      },
      {
        $project: {
          // Reshape the output
          _id: 0, // Exclude the default _id field
          totalVehicles: 1,
          totalTrips: 1,
          totalKms: 1,
          totalRevenue: 1,
        },
      },
    ]);

    const vehicleStatus = await Vehicle.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = vehicleStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      fleetSummary: stats[0] || {},
      statusBreakdown: statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching fleet statistics",
      error: error.message,
    });
  }
};
