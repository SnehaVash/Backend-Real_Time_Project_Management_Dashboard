import Task from "../models/task.model.js";


export const isTaskCreator = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized! Only task creator can perform this action" });
        }

        req.task = task;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const isTaskAssigneeOrCreator = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();
        const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

        if (!isCreator && !isAssignee) {
            return res.status(403).json({ message: "Access denied! You are not assigned to this task" });
        }

        req.task = task;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};