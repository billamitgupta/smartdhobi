const express = require('express');
const { createOrder, listOrders, getOrder } = require('../../controllers/customer/customerOrderController');
const auth = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/createOrder', auth, createOrder);
router.get('/listOrders', auth, listOrders);
router.get('/getOrder/:id', auth, getOrder);

module.exports = router;