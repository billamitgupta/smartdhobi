const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllProviders, approveProvider, banProvider, getAllUsers, banUser, getAllOrders, getAllTransactions, generateReports } = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/dashboard', getDashboardStats);
router.get('/providers', adminMiddleware, getAllProviders);
router.patch('/provider/:id/approve', adminMiddleware, approveProvider);
router.patch('/provider/:id/ban', adminMiddleware, banProvider);

router.get('/users', adminMiddleware, getAllUsers);
router.patch('/user/:id/ban', adminMiddleware, banUser);

router.get('/orders', adminMiddleware, getAllOrders);
router.get('/transactions', adminMiddleware, getAllTransactions);
router.get('/reports', adminMiddleware, generateReports);

module.exports = router;
