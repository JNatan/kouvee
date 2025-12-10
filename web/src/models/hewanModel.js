const db = require('../db');

const Hewan = {
  findAll: async (search) => {
    const q = search ? "%" + search + "%" : null;
    if (q) {
      const [rows] = await db.query(`SELECT h.*, c.nama_customer FROM hewan h JOIN customer c ON h.id_customer = c.id_customer WHERE h.nama_hewan LIKE ? OR h.jenis_hewan LIKE ? OR c.nama_customer LIKE ?`, [q, q, q]);
      return rows;
    }
    const [rows] = await db.query(`SELECT h.*, c.nama_customer FROM hewan h JOIN customer c ON h.id_customer = c.id_customer ORDER BY h.id_hewan ASC`);
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query(`SELECT h.*, c.nama_customer FROM hewan h JOIN customer c ON h.id_customer = c.id_customer WHERE id_hewan = ?`, [id]);
    return rows[0];
  },
  create: async (data) => {
    const { nama, tanggal_lahir, jenis, id_customer } = data;
    const [result] = await db.query("INSERT INTO hewan (nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer) VALUES (?, ?, ?, ?)", [nama, tanggal_lahir, jenis, id_customer]);
    return result.insertId;
  },
  update: async (id, data) => {
    const { nama, tanggal_lahir, jenis, id_customer } = data;
    await db.query("UPDATE hewan SET nama_hewan=?, tanggal_lahir_hewan=?, jenis_hewan=?, id_customer=? WHERE id_hewan=?", [nama, tanggal_lahir, jenis, id_customer, id]);
  },
  delete: async (id) => {
    await db.query("DELETE FROM hewan WHERE id_hewan=?", [id]);
  }
};

module.exports = Hewan;
