// const express = require('express');
// const { createCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidate } = require('../controllers/candidateController');

// const router = express.Router();

// router.route('/').post(createCandidate).get(getCandidates);
// router.route('/:id').get(getCandidateById).put(updateCandidate).delete(deleteCandidate);

// module.exports = router;

const express = require('express');
const {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    getCandidatesbyJobID
} = require('../controllers/candidateController');

const router = express.Router();

router.post('/create', createCandidate);   // Create a Candidate
router.get('/getCandidate', getCandidates);      // Get All Candidates with filters
router.get('/getCandidate/:id', getCandidateById); // Get Candidate By ID
router.put('/updateCandidate/:id', updateCandidate);  // Update Candidate
router.delete('/deleteCandidate/:id', deleteCandidate);
router.get('/candidates/:jobId', getCandidatesbyJobID);
module.exports = router;
