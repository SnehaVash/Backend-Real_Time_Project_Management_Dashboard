import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import { notifyUser } from "./notificationService.js";
import { createLog } from "./activityLogService.js";

export async function createProject(data, userId) {
    const project = await Project.create({
        ...data,
        createdBy: userId
    });


    await createLog({
        action: "project_created",
        performedBy: userId,
        project: project._id,
        description: `Project "${project.title}" was created`
    });
    

    return project;
}

export async function getAllProjects(userId) {
    const projects = await Project.find({
        $or: [
            { createdBy: userId },
            { members: userId }
        ]
    }).populate("createdBy", "name email")
      .populate("members", "name email");
    return projects;
}

export async function getProjectById(projectId) {
    const project = await Project.findById(projectId)
        .populate("createdBy", "name email")
        .populate("members", "name email");
    return project;
}

export async function updateProject(projectId, data) {
    const project = await Project.findById(projectId);
    if (!project) return null;

    Object.assign(project, data);
    await project.save();
    return project;
}

export async function deleteProject(projectId) {
    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);
}

export async function addMember(projectId, memberId) {
    const project = await Project.findById(projectId);
    if (!project) return null;

    if (project.members.includes(memberId)) {
        throw new Error("User is already a member!");
    }

    project.members.push(memberId);
    await project.save();

    await notifyUser({
        userId: memberId,
        message: `You have been added to project: ${project.title}`,
        type: "project"
    });

    
    await createLog({
        action: "member_added",
        performedBy: project.createdBy,
        project: project._id,
        description: `A new member was added to project "${project.title}"`
    });

    return project;
}

export async function removeMember(projectId, memberId) {
    const project = await Project.findById(projectId);
    if (!project) return null;

    project.members = project.members.filter(
        m => m.toString() !== memberId.toString()
    );

    await project.save();

    await notifyUser({
        userId: memberId,
        message: `You have been removed from project: ${project.title}`,
        type: "project"
    });


    await createLog({
        action: "member_removed",
        performedBy: project.createdBy,
        project: project._id,
        description: `A member was removed from project "${project.title}"`
    });

    return project;
}