/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    name: String,
    contactPerson: String,
    phone: String,
    alternatePhone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    gst: String,
    pan: String,
    bank: {
      name: String,
      accountNumber: String,
      ifsc: String,
      accountHolderName: String
    },
    status: String (active/inactive),
    vehicleCount: Number,
    totalBusiness: Number,
    outstandingAmount: Number,
    lastTransaction: Date,
    agreement: {
      commissionType: String (percentage/fixed),
      commissionValue: Number,
      paymentTerms: Number,
      creditLimit: Number,
      notes: String
    },
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";
const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
    },
    pan: {
      type: String,
    },
    bank: {
      name: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    vehicleCount: {
      type: Number,
      default: 0,
    },
    totalBusiness: {
      type: Number,
      default: 0,
    },
    outstandingAmount: {
      type: Number,
      default: 0,
    },

    lastTransaction: {
      type: Date,
    },

    agreement: {
      commissionType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      commissionValue: {
        type: Number,
        default: 0,
      },
      paymentTerms: {
        type: Number,
        default: 30,
      },
      creditLimit: {
        type: Number,
        default: 0,
      },
      notes: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
