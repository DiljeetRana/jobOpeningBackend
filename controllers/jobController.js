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
// getJobs = async (req, res) => {
//     try {
//         const [jobs, openJobs] = await Promise.all([
//             Job.find().populate('candidates').sort({ _id: -1 }),
//             Job.find({ status: 'Open' }).populate('candidates').sort({ _id: -1 })
//         ]);


//         res.status(200).json({
//             totalJobs: jobs.length,
//             openJobsCount: openJobs.length,
//             jobs, // All jobs
//             openJobs // Array of open jobs with full details
//         });
//     } catch (error) {
//         res.status(500).json({
//             error: error.message,
//             totalJobs: 0,
//             openJobsCount: 0,
//             jobs: [],
//             openJobs: []
//         });
//     }
// };

const getJobs = async (req, res) => {
    try {
        // Extract query parameters with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const statusFilter = req.query.status?.trim() || '';
        const searchQuery = req.query.search?.trim() || '';
        const sortField = req.query.sortBy || '_id';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Base filter - only non-deleted jobs
        const baseFilter = { isDeleted: { $ne: true } };

        // Status filter
        if (statusFilter && statusFilter !== 'All') {
            baseFilter.status = statusFilter;
        }

        // Search filter (case-insensitive)
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i');
            baseFilter.$or = [
                { title: regex },
                { description: regex },
                { location: regex },
                { 'skillsRequired': regex }
            ];
        }

        // Sorting
        const sortCriteria = { [sortField]: sortOrder };

        // Fetch jobs with pagination and filtering
        const [jobs, openJobs, totalJobs] = await Promise.all([
            Job.find(baseFilter)
                .populate('candidates')
                .sort(sortCriteria)
                .skip(skip)
                .limit(limit),

            Job.find({ ...baseFilter, status: 'Open' })
                .populate('candidates')
                .sort(sortCriteria),

            Job.countDocuments(baseFilter)
        ]);

        res.status(200).json({
            success: true,
            openJobsCount: openJobs.length,
            closedJobsCount: totalJobs - openJobs.length,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobsPerPage: limit,
            totalJobs: jobs.length,
            openJobsCount: openJobs.length,
            jobs,
            openJobs

        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch jobs',
            details: error.message,
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalJobs: 0,
                jobsPerPage: 0
            },
            counts: {
                openJobsCount: 0,
                closedJobsCount: 0
            },
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