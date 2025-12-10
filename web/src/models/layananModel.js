const db = require('../db');

const Layanan = {
  findAll: async (search) => {
    const q = search ? "%" + search + "%" : null;
    if (q) {
      const [rows] = await db.query("SELECT * FROM layanan WHERE nama_layanan LIKE ? OR deskripsi_layanan LIKE ?", [q, q]);
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM layanan ORDER BY id_layanan ASC");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM layanan WHERE id_layanan = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { nama, deskripsi, harga } = data;
    const [result] = await db.query("INSERT INTO layanan (nama_layanan, deskripsi_layanan, harga_layanan) VALUES (?, ?, ?)", [nama, deskripsi, harga]);
    return result.insertId;
  },
  update: async (id, data) => {
    const { nama, deskripsi, harga } = data;
    await db.query("UPDATE layanan SET nama_layanan=?, deskripsi_layanan=?, harga_layanan=? WHERE id_layanan=?", [nama, deskripsi, harga, id]);
  },
  delete: async (id) => {
    await db.query("DELETE FROM layanan WHERE id_layanan=?", [id]);
  }
};

module.exports = Layanan;