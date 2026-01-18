const express = require('express');
const { listNotifications, readNotification } = require('../controllers/notification/notificationController');
const router = express.Router();

router.get('/listNotifications', listNotifications);
router.patch('/readNotification/:id', readNotification);

module.exports = router;