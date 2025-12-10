const db = require('../db');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk menyimpan file di /public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // contoh: 1736812102321.jpg
  }
});

const upload = multer({ storage });
exports.uploadMiddleware = upload.single('gambar');

// === Fungsi lainnya ===

// 🔍 List semua produk + pencarian
exports.index = async (req, res) => {
  const search = req.query.q; // ambil kata kunci pencarian (kalau ada)
  let rows;

  if (search) {
    [rows] = await db.query(
      "SELECT * FROM produk WHERE nama_produk LIKE ? ORDER BY id_produk ASC",
      [`%${search}%`]
    );
  } else {
    [rows] = await db.query("SELECT * FROM produk ORDER BY id_produk ASC");
  }

  // kirim juga nilai q supaya input pencarian tetap muncul di form
  res.render('produk/list', { produk: rows, q: search || '' });
};

// 👁️ Tampilkan detail produk berdasarkan ID
exports.view = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk WHERE id_produk = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send("Produk tidak ditemukan");
    }

    // kirim data produk ke view
    res.render('produk/view', { produk: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menampilkan detail produk");
  }
};


// ➕ Form tambah produk
exports.showCreate = (req, res) => {
  res.render('produk/form', { produk: null });
};

// 💾 Simpan produk baru
exports.create = async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await db.query(
      "INSERT INTO produk (nama_produk, harga_produk, stok_produk, gambar_produk) VALUES (?, ?, ?, ?)",
      [nama, harga, stok, gambar]
    );

    res.redirect('/produk');
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menambah produk");
  }
};

// ✏️ Tampilkan form edit
exports.showEdit = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM produk WHERE id_produk = ?", [req.params.id]);
  res.render('produk/form', { produk: rows[0] });
};

// 🔄 Update data produk
exports.update = async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;
    const gambar = req.file ? req.file.filename : req.body.gambar_lama;

    await db.query(
      "UPDATE produk SET nama_produk=?, harga_produk=?, stok_produk=?, gambar_produk=? WHERE id_produk=?",
      [nama, harga, stok, gambar, req.params.id]
    );

    res.redirect('/produk');
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengubah produk");
  }
};

// ❌ Hapus produk
exports.delete = async (req, res) => {
  await db.query("DELETE FROM produk WHERE id_produk=?", [req.params.id]);
  res.redirect('/produk');
};
