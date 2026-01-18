const express = require('express');
const { createBanner, listBanners, getBanner, updateBanner, deleteBanner } = require('../../controllers/admin/adminBannerController');
const auth = require('../../middlewares/authMiddleware');
const { adminOrEmployee } = require('../../middlewares/roleMiddleware');
const router = express.Router();

router.post('/createBanner', auth, adminOrEmployee, createBanner);
router.get('/listBanners', auth, adminOrEmployee, listBanners);
router.get('/getBanner', auth, adminOrEmployee, getBanner);
router.patch('/updateBanner/:id', auth, adminOrEmployee, updateBanner);
router.delete('/deleteBanner/:id', auth, adminOrEmployee, deleteBanner);

module.exports = router;