const db = require('../db');

const Customer = {
  findAll: async (search) => {
    const q = search ? "%" + search + "%" : null;
    if (q) {
      const [rows] = await db.query("SELECT * FROM customer WHERE nama_customer LIKE ? OR no_telp_customer LIKE ?", [q, q]);
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM customer ORDER BY id_customer ASC");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM customer WHERE id_customer = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { nama, alamat, tanggal_lahir, no_telp } = data;
    const [result] = await db.query("INSERT INTO customer (nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer) VALUES (?, ?, ?, ?)", [nama, alamat, tanggal_lahir, no_telp]);
    return result.insertId;
  },
  update: async (id, data) => {
    const { nama, alamat, tanggal_lahir, no_telp } = data;
    await db.query("UPDATE customer SET nama_customer=?, alamat_customer=?, tanggal_lahir_customer=?, no_telp_customer=? WHERE id_customer=?", [nama, alamat, tanggal_lahir, no_telp, id]);
  },
  delete: async (id) => {
    await db.query("DELETE FROM customer WHERE id_customer=?", [id]);
  }
};

module.exports = Customer;
