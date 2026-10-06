import express from "express";
import {
    createJob,
    getJobs,
    getJobById,
    updateJobStatus,
    updateJob,
    deleteJob
} from "../controllers/jobController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);

router.get("/", authMiddleware, getJobs);

router.get("/:id", authMiddleware, getJobById);

router.put("/:id", authMiddleware, updateJob);

router.patch("/:id/status", authMiddleware, updateJobStatus);

router.delete("/:id", authMiddleware, deleteJob);

export default router;