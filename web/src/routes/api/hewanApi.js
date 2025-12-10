const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET ALL + SEARCH
router.get("/", async (req, res) => {
  const search = req.query.search || "";

  const [rows] = await db.query(
    `SELECT h.*, c.nama_customer 
     FROM hewan h 
     JOIN customer c ON h.id_customer = c.id_customer
     WHERE h.nama_hewan LIKE ? 
        OR h.jenis_hewan LIKE ? 
        OR c.nama_customer LIKE ?
     ORDER BY h.id_hewan ASC`,
    [`%${search}%`, `%${search}%`, `%${search}%`]
  );

  res.json({ success: true, data: rows });
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const [rows] = await db.query(
    `SELECT h.*, c.nama_customer 
     FROM hewan h 
     JOIN customer c ON h.id_customer = c.id_customer 
     WHERE h.id_hewan = ?`,
    [id]
  );

  res.json({ success: true, data: rows[0] });
});

// CREATE HEWAN
router.post("/", async (req, res) => {
  try {
    const { nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer } = req.body;

    await db.query(
      `INSERT INTO hewan (nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer)
       VALUES (?, ?, ?, ?)`,
      [nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer]
    );

    res.json({ success: true, message: "Hewan berhasil ditambahkan" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Gagal menambah hewan" });
  }
});

// UPDATE HEWAN
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer } = req.body;

    await db.query(
      `UPDATE hewan SET 
        nama_hewan=?, 
        tanggal_lahir_hewan=?, 
        jenis_hewan=?, 
        id_customer=?
       WHERE id_hewan=?`,
      [nama_hewan, tanggal_lahir_hewan, jenis_hewan, id_customer, id]
    );

    res.json({ success: true, message: "Hewan berhasil diupdate" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Gagal update hewan" });
  }
});

// DELETE HEWAN
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(`DELETE FROM hewan WHERE id_hewan=?`, [id]);

    res.json({ success: true, message: "Hewan berhasil dihapus" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Gagal menghapus hewan" });
  }
});

module.exports = router;
