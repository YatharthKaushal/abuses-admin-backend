/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    invoiceNumber: String (unique),
    bookingId: ObjectId,
    consumerId: ObjectId,
    amount: Number,
    balance: Number,
    status: String (pending/partial/completed/overdue),
    dueDate: Date,
    transactions: [{
      amount: Number,
      date: Date,
      method: String,
      reference: String
    }],
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "completed", "overdue"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        method: {
          type: String,
          required: true,
        },
        reference: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
