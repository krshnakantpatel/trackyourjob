import express from "express";
import {
    createJob,
    getJobs,
    getJobById,
    addInterview,
    updateJobStatus,
    updateJob,
} from "../controllers/jobController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);

router.get("/", authMiddleware, getJobs);

router.get("/:id", authMiddleware, getJobById);

router.post("/:id/interviews", authMiddleware, addInterview);

router.put("/:id", authMiddleware, updateJobStatus);

router.patch("/:id/status", authMiddleware, updateJob);

export default router;