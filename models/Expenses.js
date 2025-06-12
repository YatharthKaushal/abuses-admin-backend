/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    type: String (fuel/maintenance/driver_allowance/toll_parking/miscellaneous),
    amount: Number,
    vehicleId: ObjectId,
    date: Date,
    description: String,
    receipt: String,
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "fuel",
        "maintenance",
        "driver_allowance",
        "toll_parking",
        "miscellaneous",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: "",
    },
    receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
