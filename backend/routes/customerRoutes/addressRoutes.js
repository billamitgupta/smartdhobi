const express = require('express');
const { addAddress, listAddress, removeAddress, setDefaultAddress } = require('../../controllers/customer/addressController');
const auth = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post('/addAddress', auth, addAddress);
router.get('/listAddress', auth, listAddress);
router.delete('/removeAddress/:id', auth, removeAddress);
router.patch("/setDefaultAddress/:id", auth, setDefaultAddress);

module.exports = router;