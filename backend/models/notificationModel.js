// models/Notification.js
const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  type: {
    type: String,
    enum: ["order", "service", "general"],
    required: true,
  },
});

module.exports = mongoose.model("Notification", notificationModel);
