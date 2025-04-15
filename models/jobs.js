const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Pause'], default: 'Open' },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
    postingDate: { type: Date, default: Date.now },
    flag: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
