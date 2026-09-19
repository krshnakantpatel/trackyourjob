import express from "express";
import {
    createJob,
    getJobs,
} from "../controllers/jobController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);

export default router;