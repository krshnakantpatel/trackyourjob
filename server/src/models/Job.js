import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    jobTitle: {
        type: String,
        required: true,
        trim: true
    },

    jobUrl: {
        type: String,
        trim: true
    },

    company: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        trim: true
    },

    jobType: {
        type: String,
        enum: [
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
            "Freelance"
        ],
        required: true
    },

    workplaceType: {
        type: String,
        enum: [
            "On-site",
            "Hybrid",
            "Remote"
        ],
        required: true
    },

    jobDescription: {
        type: String,
        trim: true
    },

    appliedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: [
            "Applied",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn"
        ],
        default: "Applied"
    },

    interviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
        }
    ]
}, {
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);

export default Job;