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
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 15, 1),
            50
        );

        const skip = (page - 1) * limit;

        const filter = {
            user: req.user._id,
        };

        const [jobs, totalJobs] = await Promise.all([
            Job.find(filter)
                .sort({ appliedDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Job.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            jobs,
            pagination: {
                page,
                limit,
                totalJobs,
                totalPages: Math.ceil(totalJobs / limit),
            },
        });
    } catch (error) {
        console.error("Get jobs error:", error);

        return res.status(500).json({
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
                returnDocument: 'after',
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

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Delete job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete job",
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
                returnDocument: 'after',
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
