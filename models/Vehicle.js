/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    number: String (unique),
    type: String (bus/car/tempo/mini-bus),
    model: String,
    capacity: Number,
    status: String (available/booked/maintenance),
    driver: {
      name: String,
      phone: String,
      license: String,
      address: String
    },
    compliance: {
      rcExpiry: Date,
      insurance: { number: String, expiry: Date },
      fitnessExpiry: Date,
      permit: { number: String, expiry: Date },
      pocExpiry: Date
    },
    ownership: String (own/vendor),
    vendor: { vendorId: ObjectId, rate: Number, notes: String },
    stats: {
      totalTrips: Number,
      totalKms: Number,
      revenue: Number
    },
    image: String,
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      enum: ["bus", "car", "tempo", "mini-bus"],
      required: true,
    },
    model: {
      type: String,
      // required: true,
    },
    capacity: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    driver: {
      name: {
        type: String,
        //  required: true
      },
      phone: {
        type: String,
        // required: true
      },
      license: {
        type: String,
        // required: true
      },
      address: { type: String, default: "" },
    },
    compliance: {
      rcExpiry: {
        type: Date,
        // required: true
      },
      insurance: {
        number: {
          type: String,
          // required: true
        },
        expiry: {
          type: Date,
          // required: true
        },
      },
      fitnessExpiry: {
        type: Date,
        // required: true
      },
      permit: {
        number: {
          type: String,
          // required: true
        },
        expiry: {
          type: Date,
          // required: true
        },
      },
      pocExpiry: {
        type: Date,
        // required: true
      },
    },
    complianceDocuments: {
      rc: { type: String, default: "" },
      insurance: { type: String, default: "" },
      fitness: { type: String, default: "" },
      permit: { type: String, default: "" },
      poc: { type: String, default: "" },
    },
    ownership: {
      type: String,
      enum: ["own", "vendor", "leased"],
      default: "own",
    },
    vendorId: {
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
      rate: { type: Number },
      notes: { type: String },
    },
    stats: {
      totalTrips: { type: Number, default: 0 },
      totalKms: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
