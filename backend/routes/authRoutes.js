const express = require('express');
const { register, verifyOtp, login, logout, forgotPassword, resetPassword } = require('../controllers/auth/authController');
const { dealerRegister, getAllDealers, updateDealer, deleteDealer } = require('../controllers/auth/dealerRegister');
const { employeeRegister, getAllEmployees, updateEmployee, deleteEmployee } = require('../controllers/auth/employeeRegister');
const { customerRegister, getAllCustomers, updateCustomer, deleteCustomer } = require('../controllers/auth/customerRegister');
const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/dealer-register', dealerRegister);
router.get("/getAllDealers", getAllDealers);
router.patch("/updateDealer/:id", updateDealer);
router.delete("/deleteDealer/:id", deleteDealer);

router.post('/employee-register', employeeRegister);
router.get("/getAllEmployees", getAllEmployees);
router.patch("/updateEmployee/:id", updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);

router.post('/customer-register', customerRegister);
router.get("/getAllCustomers", getAllCustomers);
router.patch("/updateCustomer/:id", updateCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = router;