const db = require('../db');

const Pegawai = {
  findAll: async (search) => {
    const q = search ? "%" + search + "%" : null;
    if (q) {
      const [rows] = await db.query("SELECT * FROM pegawai WHERE nama_pegawai LIKE ? OR no_telp_pegawai LIKE ?", [q, q]);
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM pegawai ORDER BY id_pegawai ASC");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM pegawai WHERE id_pegawai = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { nama, alamat, tanggal_lahir, no_telp } = data;
    const [result] = await db.query("INSERT INTO pegawai (nama_pegawai, alamat_pegawai, tanggal_lahir_pegawai, no_telp_pegawai) VALUES (?, ?, ?, ?)", [nama, alamat, tanggal_lahir, no_telp]);
    return result.insertId;
  },
  update: async (id, data) => {
    const { nama, alamat, tanggal_lahir, no_telp } = data;
    await db.query("UPDATE pegawai SET nama_pegawai=?, alamat_pegawai=?, tanggal_lahir_pegawai=?, no_telp_pegawai=? WHERE id_pegawai=?", [nama, alamat, tanggal_lahir, no_telp, id]);
  },
  delete: async (id) => {
    await db.query("DELETE FROM pegawai WHERE id_pegawai=?", [id]);
  }
};

module.exports = Pegawai;