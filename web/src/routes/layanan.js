const express = require('express');
const router = express.Router();
const layananController = require('../controllers/layananController');
const auth = require('../controllers/authController');
const db = require('../db');

router.get('/lihat', async (req, res) => {
  const search = req.query.search || "";
  const sort = req.query.sort || "nama";

  let orderBy = "nama_layanan ASC";
  if (sort === "mahal") orderBy = "harga_layanan DESC";
  if (sort === "murah") orderBy = "harga_layanan ASC";

  const [rows] = await db.query(`
    SELECT * FROM layanan
    WHERE nama_layanan LIKE ? 
    ORDER BY ${orderBy}
  `, [`%${search}%`]);

  res.render('layanan/public', { layanan: rows, search, sort });
});

router.use(auth.ensureAuth);
router.get('/', layananController.index);
router.get('/create', layananController.showCreate);
router.post('/', layananController.create);
router.get('/view/:id', layananController.view);
router.get('/edit/:id', layananController.showEdit);
router.put('/:id', layananController.update);
router.delete('/:id', layananController.delete);

module.exports = router;