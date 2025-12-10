const express = require("express");
const router = express.Router();
const db = require("../../db");

// LOGIN API (Mobile)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT u.*, p.nama_pegawai, p.jabatan
      FROM user u
      JOIN pegawai p ON u.id_pegawai = p.id_pegawai
      WHERE username = ?
    `, [username]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Username tidak ditemukan" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(400).json({ success: false, message: "Password salah" });
    }

    // Tidak pakai session, pakai JSON response
    return res.json({
      success: true,
      message: "Login berhasil",
      user: {
        id_user: user.id_user,
        id_pegawai: user.id_pegawai,
        nama_pegawai: user.nama_pegawai,
        jabatan: user.jabatan
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
