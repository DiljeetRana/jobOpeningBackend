const express = require('express');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { createCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidate, getCandidatesbyJobID } = require('../controllers/candidateController');

const router = express.Router();
router.post('/jobs/createJob', authMiddleware, authorizeRoles('Admin', 'HR'), createJob);
router.get('/jobs/getJobs', authMiddleware, authorizeRoles('Admin', 'HR'), getJobs);
router.get('/jobs/getJob/:id', authMiddleware, authorizeRoles('Admin', 'HR'), getJobById);
router.put('/jobs/updateJob/:id', authMiddleware, authorizeRoles('Admin', 'HR'), updateJob);
router.delete('/jobs/deleteJob/:id', authMiddleware, authorizeRoles('Admin', 'HR'), deleteJob);


// Candidate Management (Both Admin and HR can manage candidates)
router.post('/candidate/create', authMiddleware, authorizeRoles('Admin', 'HR'), createCandidate);
router.get('/candidate/getCandidates', authMiddleware, authorizeRoles('Admin', 'HR'), getCandidates);
router.get('/candidate/getCandidate/:id', authMiddleware, authorizeRoles('Admin', 'HR'), getCandidateById);
router.get('/candidate/getCandidatesbyJobID/:id', authMiddleware, authorizeRoles('Admin', 'HR'), getCandidatesbyJobID);
router.put('/candidate/updateCandidate/:id', authMiddleware, authorizeRoles('Admin', 'HR'), updateCandidate);
router.put('/candidate/deleteCandidate/:id', authMiddleware, authorizeRoles('Admin', 'HR'), deleteCandidate);


module.exports = router;
