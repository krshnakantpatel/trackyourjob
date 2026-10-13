import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();



app.use(cors({
    origin: [
        "https://www.trackyourjob.me",
        "https://trackyourjob.me"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: [
        "RateLimit-Limit",
        "RateLimit-Remaining",
        "RateLimit-Reset",
        "Retry-After",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset"
    ]
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", interviewRoutes);
app.use("/api/test", testRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "TrackYourJob API is running"
    });
});

export default app;
 
