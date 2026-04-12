import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isProjectMemberOrOwner } from "../middlewares/projectMiddleware.js";
import { getProjectLogs } from "../controllers/activityLogController.js";

const router = express.Router();

router.get("/:id", verifyToken, isProjectMemberOrOwner, getProjectLogs);

export default router;