exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }
    next();
};

exports.employeeMiddleware = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied. You are not an employee.' });
    }
    next();
};

exports.dealerMiddleware = (req, res, next) => {
    if (req.user.role !== 'dealer') {
        return res.status(403).json({ message: 'Access denied. You are not an dealer.' });
    }
    next();
};

exports.adminOrEmployee = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'employee') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
};