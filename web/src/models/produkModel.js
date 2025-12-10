const db = require('../db');

const Produk = {
  // 🔍 Cari semua produk (bisa dengan pencarian nama)
  findAll: async (search) => {
    const q = search ? "%" + search + "%" : null;
    let rows;

    if (q) {
      [rows] = await db.query(
        "SELECT * FROM produk WHERE nama_produk LIKE ? ORDER BY id_produk ASC",
        [q]
      );
    } else {
      [rows] = await db.query("SELECT * FROM produk ORDER BY id_produk ASC");
    }

    return rows;
  },

  // 🔍 Cari produk berdasarkan ID
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM produk WHERE id_produk = ?", [id]);
    return rows[0];
  },

  // ➕ Tambah produk baru
  create: async (data) => {
    const { nama, harga, stok, gambar } = data;
    const [result] = await db.query(
      "INSERT INTO produk (nama_produk, harga_produk, stok_produk, gambar_produk) VALUES (?, ?, ?, ?)",
      [nama, harga, stok, gambar]
    );
    return result.insertId;
  },

  // ✏️ Update produk
  update: async (id, data) => {
    const { nama, harga, stok, gambar } = data;
    await db.query(
      "UPDATE produk SET nama_produk=?, harga_produk=?, stok_produk=?, gambar_produk=? WHERE id_produk=?",
      [nama, harga, stok, gambar, id]
    );
  },

  // ❌ Hapus produk
  delete: async (id) => {
    await db.query("DELETE FROM produk WHERE id_produk=?", [id]);
  }
};

module.exports = Produk;
