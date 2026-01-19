const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Remove "Bearer " prefix if present
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // Attach user info to the request object
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // User data is attached to request
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
