import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Job added successfully",
            job,
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create job",
        });
    }
};


export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            user: req.user.id,
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            jobs,
        });

    } catch (error) {
        console.error("Get jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
        });
    }
};