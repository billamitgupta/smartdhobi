const mongoose = require('mongoose');
const User = require('../../models/User')
const Product = require('../../models/Product');
const Notification = require("../../models/Notification");
const { getIO } = require("../../socket");

exports.pendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const skip = (Math.max(1, parseInt(page)) - 1) * Number(limit);
    const filter = { isApproved: false };

    if (q) filter.$text = { $search: q };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('dealer', 'companyName dealerId')
        .populate('employee', 'name email'),
      Product.countDocuments(filter)
    ]);

    res.json({ success: true, data: { products, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error('pendingProducts err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id).populate("dealerId");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Product is already approved"
      });
    }

    product.isApproved = true;
    product.approvedAt = new Date();
    product.approvedBy = req.user._id;
    product.isActive = true;

    await product.save();

    const notification = await Notification.create({
      userId: product.dealerId,
      message: `Your product "${product.name}" has been approved.`,
      productId: product._id,
      type: "product"
    });

    const io = getIO();
    io.to(product.dealerId.toString()).emit("new_notification", notification);

    return res.status(200).json({
      success: true,
      message: "Product approved successfully",
      data: product
    });

  } catch (err) {
    console.error("approveProduct error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id).populate("dealerId");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Product is already rejected"
      });
    }

    product.isApproved = false;
    product.isActive = false;
    product.rejectedAt = new Date();
    product.rejectedBy = req.user._id;

    await product.save();

    const notification = await Notification.create({
      userId: product.dealerId,
      message: `Your product "${product.name}" has been rejected by admin.`,
      productId: product._id,
      type: "product"
    });

    const io = getIO();
    // io.to(product.dealerId.toString()).emit("new_notification", notification);

    return res.status(200).json({
      success: true,
      message: "Product rejected successfully",
      data: product
    });

  } catch (err) {
    console.error("rejectProduct error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getDealersAndProductsByPincode = async (req, res) => {
  try {
    const { pinCode } = req.params;

    // 1️⃣ Find dealers by pincode
    const dealers = await User.find({
      role: "dealer",
      pinCode: pinCode,
      isActive: true
    }).select("-password");

    if (!dealers.length) {
      return res.json({
        success: true,
        message: "No dealers found for this pincode",
        data: []
      });
    }

    // 2️⃣ Get dealer IDs
    const dealerIds = dealers.map(d => d._id);

    // 3️⃣ Find products for those dealers
    const products = await Product.find({
      dealerId: { $in: dealerIds }
    });

    // 4️⃣ Map products to dealers
    const result = dealers.map(dealer => {
      const dealerProducts = products.filter(
        product => product.dealerId.toString() === dealer._id.toString()
      );

      return {
        dealer,
        products: dealerProducts
      };
    });

    return res.json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

