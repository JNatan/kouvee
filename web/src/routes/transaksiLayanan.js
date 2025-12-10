const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/transaksiLayananController');
const auth = require('../controllers/authController');

router.get('/', auth.ensureAuth, ctrl.list);
router.get('/create', auth.ensureAuth, ctrl.createForm);
router.post('/create', auth.ensureAuth, ctrl.create);
router.get('/view/:id', auth.ensureAuth, ctrl.view);
router.get('/edit/:id', auth.ensureAuth, ctrl.editForm);
router.post('/edit/:id', auth.ensureAuth, ctrl.update);
router.post('/update-status/:id', auth.ensureAuth, ctrl.updateStatus);

module.exports = router;
