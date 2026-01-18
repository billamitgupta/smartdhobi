const express = require('express');
const { addToCart, getCart, updateItem, removeItem } = require('../../controllers/customer/cartController');
const auth = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/addToCart', auth, addToCart);
router.get('/getCart', auth, getCart);
router.patch('/updateItem/:id', auth, updateItem);
router.delete('/removeItem/:id', auth, removeItem);

module.exports = router;