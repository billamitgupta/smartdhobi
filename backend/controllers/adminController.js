const User = require('../models/userModel');
const ServiceProvider = require('../models/serviceProviderModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');

exports.getDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: 'user' });
        const providersCount = await User.countDocuments({ role: 'dhobi' });
        const ordersCount = await Order.countDocuments();
        const earnings = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
        ]);

        res.status(200).json({
            usersCount,
            providersCount,
            ordersCount,
            totalEarnings: earnings[0]?.total || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await ServiceProvider.find().populate('userId');
        res.status(200).json({ providers });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.approveProvider = async (req, res) => {
    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            req.params.id,
            { isApproved: 'true' },
            { new: true }
        );
        res.status(200).json({ message: 'Provider approved', provider });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.banProvider = async (req, res) => {
    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            req.params.id,
            { isActive: 'false' },
            { new: true }
        );
        res.status(200).json({ message: 'Provider banned', provider });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: false },
            { new: true }
        );
        res.status(200).json({ message: 'User banned', user });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Placeholder for payments (adjust based on your implementation)
exports.getAllTransactions = async (req, res) => {
    try {
        // Replace this with actual Payment model if available
        const completedOrders = await Order.find({ paymentStatus: 'completed' });
        res.status(200).json({ transactions: completedOrders });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.generateReports = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: { $month: { $toDate: "$createdAt" } },
                    totalEarnings: { $sum: { $toDouble: "$amount" } },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        res.status(200).json({ report: orders });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
