const express = require('express');
const { addWishlist, listWishlist, removeWishlist } = require('../../controllers/customer/wishlistController');
const auth = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/addWishlist', auth, addWishlist);
router.get('/listWishlist', auth, listWishlist);
router.delete('/removeWishlist/:id', auth, removeWishlist);

module.exports = router;