const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
require('dotenv').config();

// Register User (Admin/HR)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
