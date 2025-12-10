const express = require('express');
const router = express.Router();
const p = require('../controllers/produkController');
const auth = require('../controllers/authController');
const db = require('../db');

// 🌐 Publik
router.get('/lihat', async (req, res) => {
  let { search, sort } = req.query;

  let query = "SELECT * FROM produk WHERE 1";
  let params = [];

  // Search
  if (search) {
    query += " AND nama_produk LIKE ?";
    params.push(`%${search}%`);
  }

  // Sort
  if (sort === "harga_tertinggi") query += " ORDER BY harga_produk DESC";
  else if (sort === "harga_terendah") query += " ORDER BY harga_produk ASC";
  else if (sort === "stok_terbanyak") query += " ORDER BY stok_produk DESC";
  else if (sort === "stok_tersedikit") query += " ORDER BY stok_produk ASC";
  else query += " ORDER BY nama_produk ASC";

  const [rows] = await db.query(query, params);

  res.render('produk/public', { produk: rows, search, sort });
});

// 🔐 Butuh login
router.use(auth.ensureAuth);

router.get('/', p.index);
router.get('/create', p.showCreate);
router.post('/', p.uploadMiddleware, p.create);
router.get('/view/:id', p.view);
router.get('/edit/:id', p.showEdit);
router.put('/:id', p.uploadMiddleware, p.update);
router.delete('/:id', p.delete);

module.exports = router;
