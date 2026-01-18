const express = require('express');
const { 
  createProduct, 
  listProducts, 
  getProduct, 
  updateProduct, 
  updateCommission,
  deleteProduct 
} = require('../../controllers/employee/employeeProductController');

const router = express.Router();

router.post('/createProduct', createProduct);
router.get('/listProducts', listProducts);
router.get('/getProduct/:id', getProduct);
router.patch('/updateProduct/:id', updateProduct);
router.patch('/commission/:id', updateCommission);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;
