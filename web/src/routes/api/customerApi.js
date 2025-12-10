const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET ALL + SEARCH
router.get("/", async (req, res) => {
  const search = req.query.search || "";

  const [rows] = await db.query(
    `SELECT * FROM customer
     WHERE nama_customer LIKE ? OR no_telp_customer LIKE ?
     ORDER BY id_customer ASC`,
    [`%${search}%`, `%${search}%`]
  );

  res.json({ success: true, data: rows });
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer } = req.body;

    await db.query(
      `INSERT INTO customer (nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer)
       VALUES (?, ?, ?, ?)`,
      [nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Gagal menambah customer" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer } = req.body;

    await db.query(
      `UPDATE customer SET
        nama_customer=?, alamat_customer=?, tanggal_lahir_customer=?, no_telp_customer=?
       WHERE id_customer=?`,
      [nama_customer, alamat_customer, tanggal_lahir_customer, no_telp_customer, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Gagal update customer" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM customer WHERE id_customer=?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Gagal menghapus customer" });
  }
});

module.exports = router;
