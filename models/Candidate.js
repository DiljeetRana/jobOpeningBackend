const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },

        // Interview time slot (20-minute intervals) assigned by HR
        interviewSlot: { type: String }, // e.g., "10:00AM - 10:20AM"

        // Interview schedule (date of interview)
        interviewSchedule: { type: Date },

        // Evaluation criteria
        communication: { type: Number, min: 1, max: 10, required: false }, // Rating 1-10
        personality: { type: Number, min: 1, max: 10, required: false },   // Rating 1-10
        knowledge: { type: Number, min: 1, max: 10, required: false },      // Rating 1-10

        // Interview status
        interviewStatus: {
            type: String,
            enum: ['Offered', 'Accepted', 'Missed', 'Interviewed', 'Rescheduled'],
            default: 'Offered'
        },

        // Candidate overall status in the hiring process
        status: {
            type: String,
            enum: ['Contacted','Moved to Round 2',' Moved to Round 3','Final Round', 'Shortlisted', 'Rejected', 'Hired', 'On Hold'],
            default: 'Pending'
        },
        comments:{
            type: String,
        },

        // Job reference
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        flag: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Candidate', CandidateSchema);



