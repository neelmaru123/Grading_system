const express = require("express");
const router = express.Router();
const { getNotificationsForSemseter, getNotificationsForStudent } = require("../controller/notification_controller");

router.get("/semester/:id", getNotificationsForSemseter);
router.get("/student/:id", getNotificationsForStudent);

module.exports = router;