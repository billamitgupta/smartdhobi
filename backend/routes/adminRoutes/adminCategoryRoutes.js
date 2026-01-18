const express = require('express');
const { createCategory, listCategories, updateCategory, deleteCategory } = require('../../controllers/admin/adminCategoryController');
const router = express.Router();

router.post('/createCategory', createCategory);
router.get('/listCategories', listCategories);
router.patch('/updateCategory/:id', updateCategory);
router.delete('/deleteCategory/:id', deleteCategory);

module.exports = router;