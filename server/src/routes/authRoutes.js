import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware , getMe);

export default router;
