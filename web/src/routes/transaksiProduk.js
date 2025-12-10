const express = require('express');
const router = express.Router();
const { ensureAuth, restrictTo } = require('../controllers/authController');
const ctrl = require('../controllers/transaksiProdukController');

router.use(ensureAuth, restrictTo('CS'));
router.get('/', ctrl.list);
router.get('/create', ctrl.createForm);
router.post('/create', ctrl.create);
router.get('/edit/:id', ctrl.editForm);
router.post('/edit/:id', ctrl.update);
router.get('/view/:id', ctrl.view);


module.exports = router;
