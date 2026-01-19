const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');

exports.initiatePayment = async (req, res) => {
    try {
        const { orderId, amount, method, providerId } = req.body;

        const options = {
            amount: amount * 100, // in paise
            currency: 'INR',
            receipt: `order_rcptid_${orderId}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to initiate payment', error: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
            amount,
            providerId,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const payment = new Payment({
            orderId,
            userId: req.user._id,
            providerId,
            amount,
            method: 'razorpay',
            transactionId: razorpay_payment_id,
            status: 'success',
        });

        await payment.save();

        res.status(200).json({ message: 'Payment verified', payment });
    } catch (err) {
        res.status(500).json({ message: 'Payment verification failed', error: err.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const isProvider = req.user.role === 'provider';

        const filter = isProvider ? { providerId: userId } : { userId };

        const payments = await Payment.find(filter).sort({ createdAt: -1 });

        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get payment history', error: err.message });
    }
};
