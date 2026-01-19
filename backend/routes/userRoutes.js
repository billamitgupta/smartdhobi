const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserOrders, deleteAccount, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.get('/all', getAllUsers);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/orders', authMiddleware, getUserOrders);
router.delete('/account', authMiddleware, deleteAccount);

module.exports = router;
