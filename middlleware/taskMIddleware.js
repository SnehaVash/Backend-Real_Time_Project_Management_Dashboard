import Task from "../models/task.model.js";

export const isTaskCreator = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.task = task;

    next();
  } catch {
    return res.status(400).json({ message: "Invalid task id" });
  }
};

export const isTaskAssigneeOrCreator = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();

    const isAssignee =
      task.assignedTo &&
      task.assignedTo.toString() === req.user._id.toString();

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.task = task;

    next();
  } catch {
    return res.status(400).json({ message: "Invalid task id" });
  }
};