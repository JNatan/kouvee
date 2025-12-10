const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');
const auth = require('../controllers/authController');

router.use(auth.ensureAuth);
router.get('/', c.index);
router.get('/create', c.showCreate);
router.post('/', c.create);
router.get('/view/:id', c.view);
router.get('/edit/:id', c.showEdit);
router.put('/:id', c.update);
router.delete('/:id', c.delete);

module.exports = router;
