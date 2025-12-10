const express = require('express');
const router = express.Router();
const kasirController = require('../controllers/kasirController');
const auth = require('../controllers/authController');

router.get('/', auth.ensureAuth, auth.restrictTo("KASIR"), kasirController.getDashboard);

module.exports = router;
