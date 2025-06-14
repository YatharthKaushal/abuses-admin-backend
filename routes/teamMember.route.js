import express from "express";
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamMember.controller.js"; // Adjust the path as per your project structure

const router = express.Router();

// Define routes for team member operations
router
  .route("/")
  .post(createTeamMember) // POST /api/team - Create a new team member
  .get(getAllTeamMembers); // GET /api/team - Get all team members

router
  .route("/:id")
  .get(getTeamMemberById) // GET /api/team/:id - Get a single team member by ID
  .put(updateTeamMember) // PUT /api/team/:id - Update a team member by ID
  .delete(deleteTeamMember); // DELETE /api/team/:id - Delete a team member by ID

export default router;
