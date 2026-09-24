import express from "express";
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
} from "../controllers/jobController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);
router.put("/:id", authMiddleware, updateJob);

export default router;