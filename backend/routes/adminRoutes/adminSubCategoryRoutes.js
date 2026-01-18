const express = require('express');
const { createSubCategory, listSubCategories, updateSubCategory, deleteSubCategory, getSubcategoryByCategory } = require('../../controllers/admin/adminSubCategoryController');
const router = express.Router();

router.post('/createSubCategory', createSubCategory);
router.get('/listSubCategories', listSubCategories);
router.patch('/updateSubCategory/:id', updateSubCategory);
router.delete('/deleteSubCategory/:id', deleteSubCategory);
router.get('/getSubCategory/:categoryId', getSubcategoryByCategory);

module.exports = router;