/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    vehicleType: String,
    rateType: String (km_wise/lumpsum/daily_wages),
    value: Number,
    season: String,
    validFrom: Date,
    validTo: Date,
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
    },
    rateType: {
      type: String,
      enum: ["km_wise", "lumpsum", "daily_wages"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    season: {
      type: String,
      default: "",
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Rate = mongoose.model("Rate", rateSchema);
export default Rate;
