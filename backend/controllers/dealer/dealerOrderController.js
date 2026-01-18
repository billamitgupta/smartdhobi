const Order = require('../../models/Order');

// Dealer assigned orders
exports.assignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ dealer: req.user._id });
    res.json({ success: true, orders });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Dealer update order status
exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, dealer: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
