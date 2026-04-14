import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from "../controllers/projectController.js";

import { verifyToken } from "../middlewares/authMiddleware.js"
import { isProjectOwner, isProjectMemberOrOwner } from "../middlewares/projectMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, isProjectMemberOrOwner, getProject);
router.put("/:id", verifyToken, isProjectOwner, updateProject);
router.delete("/:id", verifyToken, isProjectOwner, deleteProject);
router.post("/:id/members", verifyToken, isProjectOwner, addMember);
router.delete("/:id/members", verifyToken, isProjectOwner, removeMember);

export default router;