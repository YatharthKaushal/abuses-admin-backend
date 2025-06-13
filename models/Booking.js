/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    bookingNumber: String (unique),
    customer: {
      consumerId: ObjectId,
      name: String,
      phone: String,
      email: String
    },
    vehicle: {
      vehicleId: ObjectId,
      type: String,
      number: String,
      driver: String
    },
    trip: {
      from: String,
      to: String,
      startDate: Date,
      endDate: Date,
      totalDays: Number,
      purpose: String
    },
    payment: {
      total: Number,
      advance: Number,
      balance: Number,
      status: String (pending/partial/completed/overdue),
      rateType: String (km_wise/lumpsum/daily_wages)
    },
    status: String (pending/approved/rejected/completed),
    timeline: [{
      action: String,
      user: String,
      time: Date
    }],
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      // required: true,
    },
    customer: {
      consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      phone: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        // required: true,
      },
    },
    vehicle: {
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        // required: true,
      },
      type: {
        type: String,
        // required: true,
      },
      number: {
        type: String,
        // required: true,
      },
      driver: {
        type: String,
        // required: true,
      },
    },
    trip: {
      from: {
        type: String,
        // required: true,
      },
      to: {
        type: String,
        // required: true,
      },
      startDate: {
        type: Date,
        // required: true,
      },
      endDate: {
        type: Date,
        // required: true,
      },
      totalDays: {
        type: Number,
        // required: true,
      },
      purpose: {
        type: String,
        // required: true,
      },
    },
    payment: {
      total: {
        type: Number,
        // required: true,
      },
      advance: {
        type: Number,
        default: 0, // Default to 0 if not provided
      },
      balance: {
        type: Number,
        default: 0, // Default to 0 if not provided
      },
      status: {
        type: String,
        enum: ["pending", "partial", "completed", "overdue"],
        default: "pending",
      }, // Default to pending
      rateType: {
        type: String,
        enum: ["km_wise", "lumpsum", "daily_wages"],
        default: "km_wise",
      }, // Default to km_wise
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    }, // Default to pending
    timeline: [
      {
        action: {
          type: String,
          // required: true,
        },
        user: {
          type: String,
          // required: true,
        },
        time: {
          type: Date,
          default: Date.now, // Automatically set to current date/time
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
