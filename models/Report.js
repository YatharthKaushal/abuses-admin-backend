/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    type: String (bookings/revenue/vehicles/customers/expenses/fuel),
    data: Object,
    dateRange: { start: Date, end: Date },
    generatedBy: ObjectId,
    createdAt: Date
) */

import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "bookings",
        "revenue",
        "vehicles",
        "customers",
        "expenses",
        "fuel",
      ],
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
