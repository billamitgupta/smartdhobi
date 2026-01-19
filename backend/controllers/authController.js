const UserModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ServiceProvider = require("../models/serviceProviderModel");
const Notification = require("../models/notificationModel");
const { getIO } = require("../socket"); // Ensure this points to your socket handler

// Utility to generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP placeholder (implement actual email/SMS logic)
const sendOTP = async (email, otp) => {
  console.log(`OTP sent to ${email}: ${otp}`);
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, serviceAreas, location, role } =
      req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const userRole = role || "user";
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      serviceAreas,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      role: userRole,
      otp,
      otpExpiry,
      isVerified: userRole === "user",
    });

    await sendOTP(email, otp);

    // ✅ Notify all admins about new registration
    const admins = await UserModel.find({ role: "admin" });

    const message = `New ${userRole} registered: ${name} (${email})`;
    const io = getIO();

    for (const admin of admins) {
      const notification = new Notification({
        userId: admin._id,
        type: "general",
        message,
      });
      await notification.save();

      // Emit real-time notification
      io.to(admin._id.toString()).emit("receive-notification", notification);
    }

    res
      .status(201)
      .json({ message: "OTP sent for verification", userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let mainUserId = user._id;

    // If role is 'dhobi', get userId from ServiceProvider
    if (user.role === "dhobi") {
      const provider = await ServiceProvider.findOne({ userId: user._id });
      if (provider && provider._id) {
        mainUserId = provider._id;
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
      mainUserId, // send mainUserId separately
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout (client should handle token removal, this is just a stub)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
