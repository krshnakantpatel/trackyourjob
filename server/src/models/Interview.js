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
        enum: ["Initial screen", "Technical", "Work culture", "Panel", "Other"]
    },

    format: {
        type: String,
        enum: ["Video", "Phone", "In-person", "Other"]
    },

    deadline: Date,

    notes: String
});

const Interview = mongoose.model( "Interview" , interviewSchema);

export default Interview;