const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }
    next();
};

module.exports = adminMiddleware;
