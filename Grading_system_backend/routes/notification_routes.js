const express = require("express");
const router = express.Router();
const { getNotificationsForSemseter, getNotificationsForStudent, getLatestNotificationForStudent } = require("../controller/notification_controller");

router.get("/semester/:id", getNotificationsForSemseter);
router.get("/student/:id", getNotificationsForStudent);
router.get("/latest/:id", getLatestNotificationForStudent);

module.exports = router;