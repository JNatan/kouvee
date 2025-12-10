const express = require('express');
const router = express.Router();
const csController = require('../controllers/csController');
const { ensureAuth } = require('../controllers/authController');

router.get('/', ensureAuth, csController.getDashboard);

module.exports = router;
