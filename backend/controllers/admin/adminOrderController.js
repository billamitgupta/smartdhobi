const mongoose = require('mongoose');
const Order = require('../../models/Order');

exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, from, to, q } = req.query;
    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
    if (q) filter.$text = { $search: q };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('items.product', 'title sku price'),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: { orders, total, page: Number(page), limit: Number(limit) }
    });
  } catch (err) {
    console.error('listOrders err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Get order id:", id);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid order id required",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("address")
      .populate("items.product", "title slug sku price")
      .populate("dealerAssign.dealer", "name email")
      .populate("dealerAssign.assignedBy", "name email")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("getOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.assignOrderToDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { dealerId, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(dealerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dealer id"
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.dealerAssign) {
      return res.status(400).json({
        success: false,
        message: "Dealer already assigned to this order"
      });
    }

    order.dealerAssign = {
      dealer: dealerId,
      assignedBy: req.user._id,
      notes
    };

    order.status = "processing";

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("dealerAssign.dealer", "name email storeName")
      .populate("dealerAssign.assignedBy", "name email")
      .populate("user", "name email mobile");

    return res.json({
      success: true,
      message: "Dealer assigned successfully",
      data: updatedOrder
    });

  } catch (err) {
    console.error("assignOrderToDealer error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.unassignOrderToDealer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id"
      });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    if (!order.dealerAssign) {
      return res.status(400).json({
        success: false,
        message: "No dealer assigned to this order"
      });
    }
    order.dealerAssign = null;
    order.status = "order_placed";
    await order.save();
    return res.json({
      success: true,
      message: "Dealer unassigned successfully"
    });
  }
  catch (err) {
    console.error("unassignOrderToDealer error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


