import express from "express";
import { sendTestEmail } from "../services/emailService.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
    try {
        await sendTestEmail();

        res.status(200).json({
            message: "Test email sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to send test email",
            error: error.message
        });
    }
});

export default router;