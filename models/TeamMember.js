/** create a user schema for the following (type:"module")
 * _id: ObjectId,
    name: String,
    email: String (unique),
    phone: String,
    role: String,
    permissions: [String],
    status: String (active/inactive),
    createdAt: Date,
    updatedAt: Date
) */

import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
