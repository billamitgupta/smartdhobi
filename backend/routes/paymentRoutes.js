const express = require('express');
const { initiatePayment, verifyPayment } = require('../controllers/');
const router = express.Router();

router.post('/initiatePayment', initiatePayment);
router.post('/verifyPayment', verifyPayment);

module.exports = router;