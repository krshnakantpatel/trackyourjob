import dotenv from "dotenv";

dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Email sending error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data?.id);

        return data;
    } catch (error) {
        console.error("Email service error:", error);
        throw error;
    }
};

export const sendVerificationEmail = async ({ to, name, verificationToken }) => {
    const verificationUrl =
        `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    return sendEmail({
        to,
        subject: "Verify your TrackYourJob account",
        html: `
            <div>
                <h2>Welcome to TrackYourJob, ${name}! 👋</h2>

                <p>
                    Thanks for creating your TrackYourJob account.
                </p>

                <p>
                    Please verify your email address by clicking the button below:
                </p>

                <a
                    href="${verificationUrl}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Verify Email
                </a>

                <p>
                    This verification link will expire in 24 hours.
                </p>
            </div>
        `
    });
};

export const sendTestEmail = async () => {
    return sendEmail({
        to: "delivered@resend.dev",
        subject: "TrackYourJob Email Test",
        html: `
            <h1>Hello from TrackYourJob 👋</h1>
            <p>Your email service is working successfully.</p>
        `,
    });
};