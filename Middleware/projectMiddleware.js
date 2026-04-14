import Project from "../models/project.model.js";

export const isProjectOwner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized! Only project owner can perform this action" });
        }

        req.project = project;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const isProjectMemberOrOwner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isOwner = project.createdBy.toString() === req.user._id.toString();
        const isMember = project.members.some(m => m.toString() === req.user._id.toString());

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: "Access denied! You are not part of this project" });
        }

        req.project = project;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};