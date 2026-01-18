const Order = require("../../models/Order");

// Allowed order status flow for employees
const ALLOWED_STATUS = [
  "processing",
  "packed",
  "ready_for_dispatch",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned"
];

// LIST ASSIGNED ORDERS
exports.assignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.json({ success: true, orders });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE ORDER STATUS (EMPLOYEE ONLY)
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`
      });
    }

    // Find assigned order
    const order = await Order.findOne({ 
      _id: req.params.id, 
      assignedTo: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not assigned to this employee"
      });
    }

    // Update status
    order.status = status;

    // Add timeline entry
    order.timeline.push({
      status,
      notes: notes || "",
      changedBy: req.user._id,
      at: new Date()
    });

    await order.save();

    res.json({ success: true, message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
