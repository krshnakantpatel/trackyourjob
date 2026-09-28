import express from "express";

import {
    getMyInterviews,
    getMyInterviewById,
    addInterview,
    updateInterview,
    deleteInterview,
} from "../controllers/interviewController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/interviews", authMiddleware, getMyInterviews);

router.get(
    "/interviews/:interviewId",
    authMiddleware,
    getMyInterviewById
);

router.post("/jobs/:id/interviews", authMiddleware, addInterview);

router.put( "/jobs/:id/interviews/:interviewId", authMiddleware, updateInterview);

router.delete("/jobs/:id/interviews/:interviewId", authMiddleware, deleteInterview);

export default router;