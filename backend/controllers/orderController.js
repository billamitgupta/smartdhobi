const Order = require("../models/orderModel");
const { v4: uuidv4 } = require("uuid");
const Notification = require("../models/notificationModel");
const { getIO } = require("../socket");
const ServiceProvider = require("../models/serviceProviderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.createOrder = async (req, res) => {
  try {
    const {
      providerId,
      userId,
      services,
      pickupAddress,
      deliveryAddress,
      pickupTime,
      deliveryTime,
      amount,
      status,
      paymentStatus,
      orderId,
    } = req.body;

    if (
      !providerId ||
      !userId ||
      !services ||
      !pickupAddress ||
      !deliveryAddress ||
      !pickupTime ||
      !deliveryTime ||
      !amount
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.create({
      orderId: orderId || uuidv4(),
      providerId,
      userId,
      services,
      pickupAddress,
      deliveryAddress,
      pickupTime,
      deliveryTime,
      amount,
      status: status || "pending",
      paymentStatus: paymentStatus || "pending",
    });

    const message = `You have a new order from a customer`;

    const notification = new Notification({
      userId: providerId,
      orderId: order._id,
      type: "order",
      message,
    });
    await notification.save();

    const io = getIO(); // 👈 use getIO() to safely access io
    io.emit("receive-notification", notification);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/order/userOrders/:userId
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("providerId") // populate provider info
      .populate("userId") // populate user info
      .sort({ updatedAt: -1 }); // sort by updatedAt descending (latest first)

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/order/provider/:userId
exports.getProviderOrders = async (req, res) => {
  try {
    const dhobi = await ServiceProvider.findOne({ userId: req.params.userId });

    if (!dhobi) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    // sort by updatedAt descending (latest first)
    const orders = await Order.find({ providerId: dhobi._id })
      .populate("userId") // populate user info if needed
      .sort({ updatedAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching provider orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/order/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Valid status values
    const validStatuses = [
      "pending",
      "accepted",
      "in_progress",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get current order to check current status
    const currentOrder = await Order.findById(id).populate('userId providerId');
    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = currentOrder.status;

    // Define status flow validation rules
    const statusFlowRules = {
      pending: ["accepted", "cancelled"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["ready"],
      ready: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    // Check if the status transition is valid
    const allowedTransitions = statusFlowRules[currentStatus];
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from '${currentStatus}' to '${status}'. Allowed transitions: ${allowedTransitions.join(", ") || "none"
          }`,
      });
    }

    // Update the order status
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId providerId');

    // Create notification message based on status
    const getNotificationMessage = (newStatus, orderId) => {
      const messages = {
        accepted: `Your order #${orderId} has been accepted and is being prepared.`,
        cancelled: `Your order #${orderId} has been cancelled.`,
        in_progress: `Your order #${orderId} is now in progress.`,
        ready: `Your order #${orderId} is ready for pickup/delivery.`,
        delivered: `Your order #${orderId} has been successfully delivered.`
      };
      return messages[newStatus] || `Your order #${orderId} status has been updated to ${newStatus}.`;
    };

    // Create notification for the customer (userId)
    if (order.userId && status !== 'pending') { // Don't notify for pending status
      const message = getNotificationMessage(status, order.orderId);

      const notification = new Notification({
        userId: order.userId,
        orderId: order._id,
        type: "order",
        message,
        status: 'unread',
        createdAt: new Date()
      });

      await notification.save();

      // Emit notification via Socket.IO
      const io = getIO();
      io.to(`user_${order.userId}`).emit("receive-notification", {
        ...notification.toObject(),
        orderDetails: {
          orderId: order._id,
          status: order.status,
          updatedAt: order.updatedAt
        }
      });
    }

    // Optional: Create notification for provider when order is cancelled by customer
    if (status === 'cancelled' && order.providerId) {
      const providerMessage = `Order #${order._id} has been cancelled by the customer.`;

      const providerNotification = new Notification({
        userId: order.providerId,
        orderId: order._id,
        type: "order",
        message: providerMessage,
        status: 'unread',
        createdAt: new Date()
      });

      await providerNotification.save();

      const io = getIO();
      io.to(`user_${order.providerId}`).emit("receive-notification", {
        ...providerNotification.toObject(),
        orderDetails: {
          orderId: order._id,
          status: order.status,
          updatedAt: order.updatedAt
        }
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/order/orderManagement
exports.orderManagement = async (req, res) => {
  try {
    // Get all orders with populated user and provider info
    const orders = await Order.find()
      .populate("userId", "name email")     // Select relevant fields
      .populate("providerId", "name email");

    // Status counts
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === "in_progress").length;
    const completedOrders = orders.filter(order => order.status === "completed").length;
    const disputeOrders = orders.filter(order => order.status === "cancelled" || order.status === "dispute").length;

    // Format order data for table
    const orderList = orders.map(order => ({
      orderId: order.orderId,
      customer: order.userId?.name || "N/A",
      dhobi: order.providerId?.name || "N/A",
      amount: order.amount,
      status: order.status,
      date: order.createdAt,
      actions: {
        view: `/orders/${order._id}`,
        update: `/orders/${order._id}/edit`
      }
    }));

    res.status(200).json({
      summary: {
        totalOrders,
        pendingOrders,
        completedOrders,
        disputeOrders
      },
      orders: orderList
    });
  } catch (err) {
    console.error("Order Management Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/order/:id
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// GET /api/order/getAllOrders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("providerId") // populate provider info
      .populate("userId") // populate user info
      .sort({ updatedAt: -1 }); // sort by updatedAt descending (latest first)

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID and amount are required" });
    }

    const order = await Order.findOne({ orderId })
      .populate("userId", "name email mobile")
      .populate("providerId", "name email mobile");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "completed")
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment already completed for this order",
        });

    const razorpayOrder = await razorpay.orders.create({
      amount: parseFloat(amount) * 100,
      currency: "INR",
      receipt: `order_${orderId}_${Date.now()}`,
      notes: {
        orderId: orderId,
        userId: order.userId._id.toString(),
        providerId: order.providerId._id.toString(),
      },
    });

    await Order.findByIdAndUpdate(order._id, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: {
        id: order._id,
        orderId: order.orderId,
        customerName: order.userId.name,
        customerEmail: order.userId.email,
        customerContact: order.userId.mobile,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create payment order",
        error: error.message,
      });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;

    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required payment details" });
    }

    const order = await Order.findOne({ orderId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpaySignature) {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "completed",
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date(),
      });

      const updatedOrder = await Order.findById(order._id)
        .populate("userId", "name email mobile")
        .populate("providerId", "name email mobile owner");

      res.json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "failed",
        failureReason: "Invalid payment signature",
      });
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
  }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate("userId", "name email mobile")
      .populate("providerId", "name email mobile owner");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, paymentStatus: order.paymentStatus, order });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch payment status",
        error: error.message,
      });
  }
};

// Handle Webhook
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.get("X-Razorpay-Signature");
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (webhookSignature === expectedSignature) {
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.notes.orderId;

      if (event === "payment.captured") {
        await Order.findOneAndUpdate(
          { orderId },
          {
            paymentStatus: "completed",
            razorpayPaymentId: paymentEntity.id,
            paidAt: new Date(),
          }
        );
      } else if (event === "payment.failed") {
        await Order.findOneAndUpdate(
          { orderId },
          {
            paymentStatus: "failed",
            failureReason: paymentEntity.error_description,
          }
        );
      }

      res.status(200).json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid webhook signature" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Refund
exports.refundPayment = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order || !order.razorpayPaymentId) {
      return res
        .status(404)
        .json({ success: false, message: "Order or payment not found" });
    }

    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: amount ? parseFloat(amount) * 100 : undefined,
      notes: {
        reason: reason || "Customer requested refund",
        orderId,
      },
    });

    await Order.findByIdAndUpdate(order._id, {
      refundId: refund.id,
      refundAmount: refund.amount / 100,
      refundStatus: refund.status,
      refundedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Refund processing failed",
        error: error.message,
      });
  }
};
