const express = require('express');
const { listEmployees, getEmployee, updateEmployee, deleteEmployee } = require("../../controllers/admin/adminEmployeeController")
const router = express.Router();

router.get('/listEmployees', listEmployees);
router.get('/getEmployee/:id', getEmployee);
router.patch('/updateEmployee/:id', updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);

module.exports = router;