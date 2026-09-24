import Job from "../models/Job.js";
import Interview from "../models/Interview.js";

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
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("interviews");

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

export const updateJobStatus = async (req, res) => {
    try{
        const job = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
            { status: req.body.status },
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
            message: "Job status updated successfully",
            job,
        });
    }
    catch (error) {
        console.error("Update job status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update job status",
        });
    }
}

export const addInterview = async (req, res) => {
    try {
        // 1. Find the job and verify that it belongs to the logged-in user
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // 2. Create the interview as a separate document
        const interview = await Interview.create({
            ...req.body,
            job: job._id,
            user: req.user._id,
        });

        // 3. Store only the interview ID in the Job document
        job.interviews.push(interview._id);

        await job.save();

        res.status(201).json({
            success: true,
            message: "Interview added successfully",
            interview,
            job,
        });

    } catch (error) {
        console.error("Add interview error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add interview",
        });
    }
};