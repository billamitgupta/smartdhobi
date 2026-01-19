const express = require('express');
const router = express.Router();
const {submitReview, getProviderReviews} = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/submit', authMiddleware, submitReview);
router.get('/provider/:id', getProviderReviews);

module.exports = router;
