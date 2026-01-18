const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Notification = require("../../models/Notification");
const { getIO } = require("../../socket");

exports.dealerRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      storeName,
      storeGstin,
      panCard,
      storeAddress,
      pinCode,
    } = req.body;

    if (
      !name || !email || !password || !mobile ||
      !storeName || !storeGstin || !panCard ||
      !storeAddress || !pinCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "dealer",
      storeName,
      storeGstin,
      panCard,
      storeAddress,
      pinCode,
      isVerified: false,
      status: "pending",
    });

    const notification = await Notification.create({                   
      message: `New Dealer Registered: ${user.name}`,
      type: "dealer",
      isRead: false,
    });

    const io = getIO();
    io.emit("receive-notification", {
      message: notification.message,
      type: "dealer",
      createdAt: notification.createdAt,
    });

    return res.status(201).json({
      message: "Dealer registration successful. Wait for admin approval.",
      userId: user._id,
    });

  } catch (err) {
    console.error("Dealer Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllDealers = async (req, res) => {
  try {
    const dealers = await User.find({ role: "dealer" }).select("-password");

    if (!dealers || dealers.length === 0) {
      return res.status(404).json({ message: "No dealers found" });
    }

    return res.status(200).json({
      message: "Dealers fetched successfully",
      total: dealers.length,
      data: dealers,
    });
  } catch (err) {
    console.error("Get Dealers Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;

    const allowedStatus = ["approved", "rejected", "pending"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const dealer = await User.findOne({ _id: id, role: "dealer" });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    dealer.status = status || dealer.status;
    dealer.isVerified = isVerified !== undefined ? isVerified : dealer.isVerified;

    await dealer.save();

    return res.status(200).json({
      message: "Dealer status updated successfully",
      data: dealer,
    });
  } catch (err) {
    console.error("Approve Dealer Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await User.findOne({ _id: id, role: "dealer" });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    dealer.status = "rejected";
    dealer.isVerified = false;

    await dealer.save();

    return res.status(200).json({
      message: "Dealer rejected successfully",
      data: dealer,
    });
  } catch (err) {
    console.error("Reject Dealer Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
