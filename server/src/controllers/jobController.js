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

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        console.error("Get job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job",
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job,
        });
    } catch (error) {
        console.error("Update job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update job",
        });
    }
};