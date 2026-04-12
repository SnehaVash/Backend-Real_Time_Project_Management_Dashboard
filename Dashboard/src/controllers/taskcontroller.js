import * as taskService from "../services/taskService.js";
import { successResponse, errorResponse } from "../utils/helpers.js";

export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project are required!" });
    }

    const task = await taskService.createTask(
      { title, description, status, priority, project: projectId, assignedTo, dueDate },
      req.user._id
    );

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const tasks = await taskService.getAllTasks(projectId);
    res.json(tasks);

  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const task = await taskService.updateTask(
      req.params.id,
      { title, description, status, priority, assignedTo, dueDate }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    next(error);
  }
}