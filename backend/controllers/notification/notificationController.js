const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

exports.listNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.params.userId,
            isRead: false
        }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.readNotification = async (req, res) => {
    try {
        const updated = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};