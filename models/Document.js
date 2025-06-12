/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    name: String,
    type: String (contract/duty_slip/other),
    url: String,
    bookingId: ObjectId,
    vehicleId: ObjectId,
    size: Number,
    uploadedBy: ObjectId,
    createdAt: Date
) */

import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["contract", "duty_slip", "other"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    size: {
      type: Number, // Size in bytes
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
