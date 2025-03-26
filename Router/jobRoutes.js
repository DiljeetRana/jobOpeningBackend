// const express = require('express');
// const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');

// const router = express.Router();

// router.route('/').post(createJob).get(getJobs);
// router.route('/:id').get(getJobById).put(updateJob).delete(deleteJob);

// module.exports = router;
const express = require('express');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

const router = express.Router();
    
router.post('/createJob', createJob);   // Create a Job
router.get('/getJobs', getJobs);      // Get All Jobs
router.get('/getJob/:id', getJobById); // Get Job By ID
router.put('/updateJob/:id', updateJob);  // Update Job
router.delete('/deleteJob/:id', deleteJob); // Delete Job

module.exports = router;
