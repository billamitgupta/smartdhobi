const express = require('express');
const {
  assignedOrders,
  updateStatus
} = require('../../controllers/dealer/dealerOrderController');

const router = express.Router();

router.get('/assigned-orders', assignedOrders);
router.patch('/:id/status', updateStatus);

module.exports = router;
