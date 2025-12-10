const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawaiController');
const auth = require('../controllers/authController');

router.use(auth.ensureAuth);
router.get('/', pegawaiController.index);
router.get('/create', pegawaiController.showCreate);
router.post('/', pegawaiController.create);
router.get('/view/:id', pegawaiController.view);
router.get('/edit/:id', pegawaiController.showEdit);
router.put('/:id', pegawaiController.update);
router.delete('/:id', pegawaiController.delete);

module.exports = router;