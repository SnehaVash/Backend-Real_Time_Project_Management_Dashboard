import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject} from "../controllers/projectcontroller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;