import mongoose from "mongoose";


const interviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    questions: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: String,
      trim: true,
    },

    learnings: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
    },
    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata"
    },

    deadline: Date,

});

const Interview = mongoose.model( "Interview" , interviewSchema);

export default Interview;