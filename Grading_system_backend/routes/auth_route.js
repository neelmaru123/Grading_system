const authController = require('../controller/auth_controller');
const express = require('express');
const router = express.Router();

const { studentAuthenticator, facultyAuthenticator } = authController;

router.post('/student/login', studentAuthenticator);

router.post('/faculty/login', facultyAuthenticator);

module.exports = router;