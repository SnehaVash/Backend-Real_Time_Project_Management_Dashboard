import Task from "../models/task.model.js";
import { notifyUser } from "./notificationService.js";
import { createLog } from "./activityLogService.js";

export async function createTask(data, userId) {
    const task = await Task.create({
        ...data,
        createdBy: userId
    });

    if (task.assignedTo) {
        await notifyUser({
            userId: task.assignedTo,
            message: `You have been assigned a new task: ${task.title}`,
            type: "task"
        });
    }

    
    await createLog({
        action: "task_created",
        performedBy: userId,
        project: data.project,
        task: task._id,
        description: `Task "${task.title}" was created`
    });

    return task;
}

export async function getAllTasks(projectId) {
    const tasks = await Task.find({ project: projectId })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
    return tasks;
}

export async function getTaskById(taskId) {
    const task = await Task.findById(taskId)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
    return task;
}

export async function updateTask(taskId, data) {
    const task = await Task.findById(taskId);
    if (!task) return null;

    if (data.assignedTo && data.assignedTo.toString() !== task.assignedTo?.toString()) {
        await notifyUser({
            userId: data.assignedTo,
            message: `You have been assigned a task: ${task.title}`,
            type: "task"
        });
    }

    Object.assign(task, data);
    await task.save();

    
    await createLog({
        action: "task_updated",
        performedBy: task.createdBy,
        project: task.project,
        task: task._id,
        description: `Task "${task.title}" was updated`
    });

    return task;
}

export async function deleteTask(taskId) {
    await Task.findByIdAndDelete(taskId);
}