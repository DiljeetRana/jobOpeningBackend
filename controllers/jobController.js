const Job = require('../models/jobs');

createJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        console.log("job req.body ", req.body)
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// getJobs = async (req, res) => {
//     try {
//         const [jobs, openJobs] = await Promise.all([
//             Job.find().populate('candidates'),
//             Job.find({ status: 'Open' })
//         ]);

//         res.status(200).json({
//             totalJobs: jobs.length,
//             openJobsCount: openJobs.length,
//             jobs
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             error: error.message,
//             totalJobs: 0,
//             openJobsCount: 0
//         });
//     }
// };
getJobs = async (req, res) => {
    try {
        const [jobs, openJobs] = await Promise.all([
            Job.find().populate('candidates'),
            Job.find({ status: 'Open' }).populate('candidates') // Added populate for consistency
        ]).sort({ _id: -1 });

        res.status(200).json({
            totalJobs: jobs.length,
            openJobsCount: openJobs.length,
            jobs, // All jobs
            openJobs // Array of open jobs with full details
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            totalJobs: 0,
            openJobsCount: 0,
            jobs: [],
            openJobs: []
        });
    }
};

getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('candidates').sort({ _id: -1 });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
}