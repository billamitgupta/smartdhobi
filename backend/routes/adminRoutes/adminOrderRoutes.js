const express = require('express');
const { listOrders, getOrder, assignOrderToDealer,unassignOrderToDealer } = require('../../controllers/admin/adminOrderController');
const auth = require('../../middlewares/authMiddleware');
const router = express.Router();

router.get('/listOrders', listOrders);
router.get('/getOrder/:id', getOrder);
router.post('/assignOrderToDealer/:id', auth, assignOrderToDealer);
router.delete('/unassignOrderToDealer/:id', auth, unassignOrderToDealer);

module.exports = router;