const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getProviderOrders, updateOrderStatus, orderManagement, getOrderDetails ,getAllOrders, createRazorpayOrder, verifyPayment, getPaymentStatus, handleWebhook, refundPayment} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/create', createOrder);
router.get('/userOrders/:userId', getUserOrders);
router.get('/getAllOrders', getAllOrders);
router.get('/dhobiOrders/:userId', getProviderOrders);
router.patch('/:id/status', updateOrderStatus);
router.get('/orderManagement', orderManagement);
router.get('/:id', getOrderDetails);

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/payment-status/:orderId', getPaymentStatus);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/refund', refundPayment);

module.exports = router;
