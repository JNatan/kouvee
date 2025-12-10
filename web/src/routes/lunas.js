const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lunasController');
const auth = require('../controllers/authController');

router.get('/', auth.ensureAuth, auth.restrictTo('Kasir'), ctrl.list);

router.get('/view/:id', auth.ensureAuth, auth.restrictTo('Kasir'), ctrl.view);

router.get('/cetak/:id', auth.ensureAuth, auth.restrictTo('Kasir'), ctrl.print);

module.exports = router;
