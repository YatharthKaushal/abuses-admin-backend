/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    name: String,
    phone: String,
    email: String,
    address: String,
    company: String,
    type: String (regular/corporate/new),
    totalBookings: Number,
    totalAmount: Number,
    outstandingAmount: Number,
    createdAt: Date,
    updatedAt: Date
) */
import mongoose from "mongoose";

const consumerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["regular", "corporate", "new"],
      default: "new",
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    outstandingAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Consumer = mongoose.model("Consumer", consumerSchema);
export default Consumer;
