const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to verify token
exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ error: "User not found." });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};

// Role-based authorization
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("Authorization")
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Unauthorized role." });
        }
        next();
    };
};
