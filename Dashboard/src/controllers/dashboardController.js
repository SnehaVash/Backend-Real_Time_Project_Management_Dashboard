import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/helpers.js";

export async function getDashboard(req, res, next) {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole === "manager") {
      
      const totalProjects = await Project.countDocuments({ createdBy: userId });

      const totalTasks = await Task.countDocuments({
        project: { $in: await Project.find({ createdBy: userId }).distinct("_id") }
      });

      const completedTasks = await Task.countDocuments({
        status: "completed",
        project: { $in: await Project.find({ createdBy: userId }).distinct("_id") }
      });

      const inProgressTasks = await Task.countDocuments({
        status: "in-progress",
        project: { $in: await Project.find({ createdBy: userId }).distinct("_id") }
      });

      const upcomingDeadlines = await Task.find({
        dueDate: { $gte: new Date() },
        project: { $in: await Project.find({ createdBy: userId }).distinct("_id") }
      }).sort({ dueDate: 1 }).limit(5);

      const members = await User.find({ isActive: true, role: "member" })
        .select("name email avatar");

      return res.status(200).json({
        role: "manager",
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        upcomingDeadlines,
        members
      });

    } else {

      const myTasks = await Task.countDocuments({ assignedTo: userId });

      const myCompletedTasks = await Task.countDocuments({
        assignedTo: userId,
        status: "completed"
      });

      const myInProgressTasks = await Task.countDocuments({
        assignedTo: userId,
        status: "in-progress"
      });

      const myUpcomingDeadlines = await Task.find({
        assignedTo: userId,
        dueDate: { $gte: new Date() }
      }).sort({ dueDate: 1 }).limit(5);

      return res.status(200).json({
        role: "member",
        myTasks,
        myCompletedTasks,
        myInProgressTasks,
        myUpcomingDeadlines
      });
    }

  } catch (error) {
    next(error);
  }
}