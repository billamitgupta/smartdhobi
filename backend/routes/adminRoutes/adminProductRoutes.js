const express = require('express');
const { pendingProducts, approveProduct, rejectProduct, getDealersAndProductsByPincode } = require('../../controllers/admin/adminProductController');
const auth = require('../../middlewares/authMiddleware');
const { adminOrEmployee } = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.get('/pendingProducts', pendingProducts);
router.patch('/rejectProduct/:id', auth, adminOrEmployee, rejectProduct);
router.patch('/approveProduct/:id', auth, adminOrEmployee, approveProduct);
router.get('/dealers-by-pincode/:pinCode', auth, adminOrEmployee, getDealersAndProductsByPincode );

module.exports = router;