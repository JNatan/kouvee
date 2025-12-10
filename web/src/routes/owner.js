const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { ensureAuth } = require('../controllers/authController');

router.get('/', ensureAuth, ownerController.getDashboard);

module.exports = router;