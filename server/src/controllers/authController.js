import crypto from "crypto";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import { generateVerificationToken } from "../utils/tokenUtils.js";
import { sendVerificationEmail } from "../services/emailService.js";

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const isStrongPassword = (password) => {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields (name, email, password) are required"
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email"
            });
        }

        const { verificationToken, hashedToken } =
            generateVerificationToken();

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            emailVerificationToken: hashedToken,
            emailVerificationExpires:
                new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        // await sendVerificationEmail({
        //     to: user.email,
        //     name: user.name,
        //     verificationToken
        // });

        const authToken = generateToken(user._id);

        return res.status(201).json({
            message: "User registered successfully",
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        // MongoDB duplicate-key protection
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists with this email"
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error during registration"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const authToken = generateToken(user._id);

        res.status(200).json({
            message: "User logged in successfully",
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error during login",
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error fetching user profile",
            error: error.message
        });
    }
};
