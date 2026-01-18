const express = require('express');
const { assignedOrders, updateStatus } = require('../../controllers/employee/employeeOrderController');
const router = express.Router();

router.get('/assigned-orders', assignedOrders);
router.patch('/:id/status', updateStatus);

module.exports = router;
