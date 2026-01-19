const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");
const Order = require("../models/orderModel");

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err });
  }
};
// GET /api/user/all
exports.getAllUsers = async (req, res) => {
    try {
        const profiles = await User.find();

        console.log("Fetched profiles:", profiles);
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: "No user profiles found" });
        }
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch profiles", error: err });
    }
};

// PATCH /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { preferences, addresses } = req.body;
    const updated = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { preferences, addresses },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err });
  }
};

// GET /api/user/orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

// DELETE /api/user/account
exports.deleteAccount = async (req, res) => {
  try {
    await UserProfile.deleteOne({ userId: req.user.id });
    await User.deleteOne({ _id: req.user.id });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account", error: err });
  }
};
