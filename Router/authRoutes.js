const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

// Register (For Admin use)
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Admin', 'HR']).withMessage('Invalid role')
], registerUser);

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], loginUser);

module.exports = router;
