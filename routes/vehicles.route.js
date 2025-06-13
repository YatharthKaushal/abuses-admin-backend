import express from "express";
import {
  createVehicle,
  getVehicleById,
  getVehicleByNumber,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  getComplianceNearingExpiry,
  getFleetStats,
} from "../controllers/vehicles.controller.js";

const router = express.Router();

// =================================================================
// IMPORTANT:
// Routes with specific keywords (e.g., 'stats', 'compliance') must be defined
// BEFORE routes with dynamic parameters (e.g., '/:id') to avoid conflicts
// and ensure correct route matching.
// =================================================================

/**
 * @route   GET /api/vehicles/stats/overall
 * @desc    Get overall fleet statistics
 * @access  Private/Admin
 */
router.get("/stats/overall", getFleetStats);

/**
 * @route   GET /api/vehicles/compliance/nearing-expiry
 * @desc    Get vehicles with compliance documents nearing expiry
 * @access  Private/Admin
 */
router.get("/compliance/nearing-expiry", getComplianceNearingExpiry);

/**
 * @route   GET /api/vehicles/number/:number
 * @desc    Get a single vehicle by its registration number
 * @access  Public
 */
router.get("/number/:number", getVehicleByNumber);

/**
 * @route   GET /api/vehicles/
 * @desc    Get all vehicles with filtering and pagination
 * @access  Public
 *
 * @route   POST /api/vehicles/
 * @desc    Create a new vehicle
 * @access  Private/Admin
 */
router.route("/").get(getAllVehicles).post(createVehicle);

/**
 * @route   PUT /api/vehicles/:identifier
 * @desc    Update a vehicle by its ID or registration number
 * @access  Private/Admin
 */
router.put("/:identifier", updateVehicle);

/**
 * @route   GET /api/vehicles/:id
 * @desc    Get a single vehicle by its MongoDB ID
 * @access  Public
 * @route   DELETE /api/vehicles/:id
 * @desc    Delete a vehicle by its ID
 * @access  Private/Admin
 */
router.route("/:id").get(getVehicleById).delete(deleteVehicle);

export default router;
