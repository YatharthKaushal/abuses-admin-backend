/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    name: String,
    email: String (unique),
    password: String,
    role: String (owner/admin/employee),
    avatar: String,
    phone: String,
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "employee"],
      default: "employee",
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);
export default User;
