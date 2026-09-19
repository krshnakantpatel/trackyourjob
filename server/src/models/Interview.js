import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    type: {
        type: String,
        enum: ["Initial Screen", "Technical", "Work Culture", "Panel", "Other"]
    },

    format: {
        type: String,
        enum: ["Video", "Phone", "In-person", "Other"]
    },

    deadline: Date,

    notes: String
});

const Interview = mongoose.Model( "Interview" , interviewSchema);

export default Interview;