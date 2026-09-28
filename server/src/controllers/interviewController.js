import Interview from "../models/Interview.js";
import Job from "../models/Job.js";

export const addInterview = async (req, res) => {
    try {
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

        const {
            type,
            date,
            time,
            format,
            questions,
            experience,
            learnings,
        } = req.body;

        const interview = await Interview.create({
            job: job._id,
            user: req.user._id,

            type,
            date,
            time,
            format,

            questions: Array.isArray(questions)
                ? questions.filter((question) => question.trim())
                : [],

            experience,
            learnings,
        });

        job.interviews.push(interview._id);
        await job.save();

        const updatedJob = await Job.findById(job._id)
            .populate("interviews");

        return res.status(201).json({
            success: true,
            message: "Interview experience saved successfully",
            interview,
            job: updatedJob,
        });
    } catch (error) {
        console.error("Add interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save interview experience",
        });
    }
};

export const updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.interviewId,
            user: req.user._id,
            job: req.params.id,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview experience not found",
            });
        }

        const {
            type,
            date,
            time,
            format,
            questions,
            experience,
            learnings,
        } = req.body;

        interview.type = type;
        interview.date = date;
        interview.time = time;
        interview.format = format;

        interview.questions = Array.isArray(questions)
            ? questions.filter((question) => question.trim())
            : [];

        interview.experience = experience;
        interview.learnings = learnings;

        await interview.save();

        const updatedJob = await Job.findById(req.params.id)
            .populate("interviews");

        return res.status(200).json({
            success: true,
            message: "Interview experience updated successfully",
            interview,
            job: updatedJob,
        });
    } catch (error) {
        console.error("Update interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update interview experience",
        });
    }
};

export const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.interviewId,
            user: req.user._id,
            job: req.params.id,
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview experience not found",
            });
        }

        await Interview.deleteOne({
            _id: interview._id,
        });

        await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
            {
                $pull: {
                    interviews: interview._id,
                },
            }
        );

        const updatedJob = await Job.findById(req.params.id)
            .populate("interviews");

        return res.status(200).json({
            success: true,
            message: "Interview experience deleted successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Delete interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete interview experience",
        });
    }
};

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.user._id,
        })
            .populate("job", "company jobTitle")
            .sort({
                date: -1,
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            interviews,
        });
    } catch (error) {
        console.error("Get my interviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview experiences",
        });
    }
};

export const getMyInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.interviewId,
            user: req.user._id,
        }).populate("job", "company jobTitle jobUrl");

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview experience not found",
            });
        }

        return res.status(200).json({
            success: true,
            interview,
        });
    } catch (error) {
        console.error("Get interview error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview experience",
        });
    }
};

