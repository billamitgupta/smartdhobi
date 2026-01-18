const express = require('express');
const { listDealers, getDealer, updateDealer, deleteDealer } = require('../../controllers/admin/adminDealerController');
const router = express.Router();

router.get('/listDealers', listDealers);
router.get('/getDealer/:id', getDealer);
router.patch('/updateDealer/:id', updateDealer);
router.delete('/deleteDealer/:id', deleteDealer);

module.exports = router;