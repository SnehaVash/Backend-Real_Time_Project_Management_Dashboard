import Project from "../models/project.model.js";

export const isProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.project = project;

    next();
  } catch {
    return res.status(400).json({ message: "Invalid project id" });
  }
};

export const isProjectMemberOrOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();

    const isMember = project.members.some(
      m => m.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.project = project;

    next();
  } catch {
    return res.status(400).json({ message: "Invalid project id" });
  }
};