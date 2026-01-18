const express = require('express');
const { listApproved, getById, listByCategory, listByDealer, listByEmployee, search } = require('../../controllers/customer/customerProductController');
const router = express.Router();

router.get('/listApproved', listApproved);
router.get('/getById/:id', getById);
router.get('/listByCategory/:CategoryId', listByCategory);
router.get('/dealer/:dealerId', listByDealer);
router.get('/employee/:employeeId', listByEmployee);
router.get('/search', search);

module.exports = router;