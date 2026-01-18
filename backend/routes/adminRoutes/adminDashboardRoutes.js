const express = require('express');
const { overview, salesReport, productReport } = require('../../controllers/admin/adminDashboardController');
const router = express.Router();

router.get('/overview', overview);
router.get('/salesReport', salesReport);
router.get('/productReport/:id', productReport);

module.exports = router;