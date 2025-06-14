import TeamMember from "../models/TeamMember.js";

// @desc    Create a new team member
// @route   POST /api/teamM
// @access  Private (e.g., admin only)
export const createTeamMember = async (req, res) => {
  try {
    const { name, email, phone, role, permissions, status } = req.body;

    // Basic validation for required fields
    if (!name || !email || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, and role are required fields." });
    }

    // Check if a team member with the given email already exists
    const existingTeamMember = await TeamMember.findOne({ email });
    if (existingTeamMember) {
      return res
        .status(409)
        .json({ message: "A team member with this email already exists." });
    }

    const newTeamMember = new TeamMember({
      name,
      email,
      phone,
      role,
      permissions,
      status,
    });

    const savedTeamMember = await newTeamMember.save();
    res.status(201).json(savedTeamMember); // 201 Created
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error.code === 11000) {
      // Duplicate key error for unique email
      return res.status(409).json({
        message: "Duplicate email. This email is already in use.",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({});
    res.status(200).json(teamMembers);
  } catch (error) {
    console.error("Error fetching all team members:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a single team member by ID
// @route   GET /api/team/:id
// @access  Private
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." }); // 404 Not Found
    }
    res.status(200).json(teamMember);
  } catch (error) {
    console.error("Error fetching team member by ID:", error);
    // Handle invalid Mongoose ID format
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid team member ID format." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a team member by ID
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, permissions, status } = req.body;

    // Find and update the team member
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validators on update
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      id,
      { name, email, phone, role, permissions, status },
      { new: true, runValidators: true }
    );

    if (!updatedTeamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    res.status(200).json(updatedTeamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid team member ID format." });
    }
    if (error.code === 11000) {
      // Duplicate key error for unique email
      return res.status(409).json({
        message:
          "Duplicate email. This email is already in use by another team member.",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a team member by ID
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeamMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedTeamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    res.status(200).json({ message: "Team member deleted successfully." }); // 200 OK
  } catch (error) {
    console.error("Error deleting team member:", error);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "Invalid team member ID format." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
