import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { isTaskCreator, isTaskAssigneeOrCreator } from "../middlewares/taskMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, isTaskAssigneeOrCreator, getTaskById);
router.put("/:id", verifyToken, isTaskAssigneeOrCreator, updateTask);
router.delete("/:id", verifyToken, isTaskCreator, deleteTask);

export default router;