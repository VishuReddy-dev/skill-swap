import { Skills } from "../models/Skills.js";

// Create New Skill
export const createSkill = async (req, res) => {
  const { title, description } = req.body;
  const createdBy = req.user._id;
  // Check if required fields are provided
  if (!title || !description || !req.file) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const skill = new Skills({
      title,
      description,
      image: req.file.path, // Save file path from multer
      createdBy, // Extract userId from the auth middleware
    });

    await skill.save();

    res.status(201).json({
      message: "Skill created successfully.",
      skill: {
        ...skill._doc, // Spread the skill object to include all other fields
        image: `${req.protocol}://${req.get("host")}/${skill.image}`, // Convert relative path to full URL
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skills.find().populate("createdBy", "name email");
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get skill by ID
export const getSkillById = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skills.findById(id).populate("createdBy", "name email");
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skills.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userSkills = async (req, res) => {
  const { id } = req.params;
  try {
    const skills = await Skills.find({ createdBy: id }).populate(
      "createdBy",
      "name email"
    );
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
