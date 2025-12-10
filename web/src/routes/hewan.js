const express = require('express');
const router = express.Router();
const h = require('../controllers/hewanController');
const auth = require('../controllers/authController');

router.use(auth.ensureAuth);
router.get('/', h.index);
router.get('/create', h.showCreate);
router.post('/', h.create);
router.get('/view/:id', h.view);
router.get('/edit/:id', h.showEdit);
router.put('/:id', h.update);
router.delete('/:id', h.delete);

module.exports = router;
