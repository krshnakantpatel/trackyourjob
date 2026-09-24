import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        // =====================================================
        // USER
        // =====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // =====================================================
        // JOB INFORMATION
        // =====================================================

        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        jobUrl: {
            type: String,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Contract",
                "Internship",
                "Freelance",
            ],
            required: true,
        },

        workplaceType: {
            type: String,
            enum: ["On-site", "Hybrid", "Remote"],
            required: true,
        },

        jobDescription: {
            type: String,
            trim: true,
        },

        // =====================================================
        // APPLICATION INFORMATION
        // =====================================================

        appliedDate: {
            type: Date,
            default: Date.now,
        },

        source: {
            type: String,
            enum: [
                "LinkedIn",
                "Company Site",
                "Referral",
                "Recruiter",
                "Job Board",
                "Other",
            ],
            default: "Other",
        },

        referralContact: {
            type: String,
            trim: true,
        },

        // Current stage of the application
        status: {
            type: String,
            enum: [
                "Applied",
                "Interview",
                "Offer",
                "Rejected",
                "Withdrawn",
            ],
            default: "Applied",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        // =====================================================
        // FOLLOW-UP
        // =====================================================

        nextFollowUpDate: {
            type: Date,
        },

        // =====================================================
        // COMPENSATION
        // =====================================================

        salaryMin: {
            type: Number,
        },

        salaryMax: {
            type: Number,
        },

        salaryCurrency: {
            type: String,
            default: "INR",
        },

        // =====================================================
        // CONTACTS
        // =====================================================

        recruiter: {
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
            },
            phone: {
                type: String,
                trim: true,
            },
        },

        hiringManager: {
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
            },
        },

        // =====================================================
        // OUTCOME
        // =====================================================

        outcome: {
            reason: {
                type: String,
                trim: true,
            },

            offerDetails: {
                ctc: Number,

                joiningDate: Date,

                notes: {
                    type: String,
                    trim: true,
                },
            },
        },

        // =====================================================
        // INTERVIEWS
        // =====================================================

        interviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Interview",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;