import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getDashboard);

export default router;