const Candidate = require('../models/Candidate');
const Job = require('../models/jobs');

const createCandidate = async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        console.log("candidate req body:::::",req.body)
        await candidate.save();

        await Job.findByIdAndUpdate(candidate.job, { $push: { candidates: candidate._id } });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCandidates = async (req, res) => {
    try {
        const { jobId, status, search } = req.query;
        let filters = {};
        if (jobId) filters.job = jobId;
        if (status) filters.status = status;
        if (search) filters.name = { $regex: search, $options: 'i' };

        const candidates = await Candidate.find(filters).populate('job');
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('job');
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        await Job.findByIdAndUpdate(candidate.job, { $pull: { candidates: candidate._id } });
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all candidates by jobId
const getCandidatesbyJobID= async (req, res) => {
    try {
        const { jobId } = req.params;

        // Fetch candidates with matching jobId
        const candidates = await Candidate.find({ job: jobId });

        if (!candidates.length) {
            return res.status(404).json({ message: 'No candidates found for this job' });
        }

        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


module.exports = {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    getCandidatesbyJobID
}