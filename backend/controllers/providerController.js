const ServiceProvider = require("../models/serviceProviderModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
// Create a new service provider
exports.createProvider = async (req, res) => {
  try {
    // Step 1: Create User with timeout handling
    const { name, email, mobile, password, location, serviceAreas, profilePicture, role } = req.body;

    // Check if user already exists to avoid duplicates
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    }).maxTimeMS(5000); // 5 second timeout for query

    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email or mobile already exists" 
      });
    }
 const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      password:hashedPassword,
      location,
      serviceAreas,
      profilePicture,
      role: role || "dhobi", 
    });

    // Save user with timeout
    const savedUser = await newUser.save({ 
      maxTimeMS: 10000 // 10 second timeout
    });

    // Step 2: Create Provider with userId
    const providerData = {
      ...req.body,
      userId: savedUser._id, // Store reference to created user
    };

    const provider = new ServiceProvider(providerData);
    await provider.save({ 
      maxTimeMS: 10000 // 10 second timeout
    });

    res.status(201).json({
      message: "Service provider and user created",
      user: savedUser,
      provider,
    });
  } catch (err) {
    console.error('Error creating provider:', err);
    
    // Handle specific timeout errors
    if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: "Database connection timeout. Please try again." 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "User with this email or mobile already exists" 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        details: err.message 
      });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};
// GET /api/provider
exports.getProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.status(200).json({ providers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/profile
exports.getProfile = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ _id: req.params.id });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.status(200).json({ provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/provider/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const provider = await ServiceProvider.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true }
    );
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.status(200).json({ message: "Profile updated", provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.activeProvider = async (req, res) => {
  try {
    const updates = req.body;
    const providerId = req.params.id; // This is the provider's ID
    
    // First, get the provider to extract userId
    const existingProvider = await ServiceProvider.findById(providerId);
    
    if (!existingProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    
    const userId = existingProvider.userId;
    
    // Update ServiceProvider schema
    const provider = await ServiceProvider.findByIdAndUpdate(
      providerId,
      updates,
      { new: true }
    );
    
    // Update User schema - set isVerified to true using the userId from provider
    const user = await User.findByIdAndUpdate(
      userId, 
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: "Provider approved and user verified successfully", 
      provider,
      user: {
        id: user._id,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// PATCH /api/provider/toggle-active
exports.toggleActive = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ _id: req.params.id });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    provider.isActive = provider.isActive === true ? false : true;
    await provider.save();

    res.status(200).json({
      message: `Provider is now ${
        provider.isActive === "true" ? "active" : "inactive"
      }`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ providerId: req.user.userId });
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/provider/order/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: id},
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.userId });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const orders = await Order.find({ providerId: req.user.userId });
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;
    const earnings = provider.earnings || "0";

    res.status(200).json({
      totalOrders,
      completedOrders,
      earnings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
