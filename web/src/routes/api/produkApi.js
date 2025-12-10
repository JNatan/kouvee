const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET PRODUK PUBLIC
router.get("/", async (req, res) => {
  const { search = "", sort = "" } = req.query;

  let sql = "SELECT * FROM produk WHERE nama_produk LIKE ?";
  let order = "";

  if (sort === "harga_asc") order = " ORDER BY harga_produk ASC";
  if (sort === "harga_desc") order = " ORDER BY harga_produk DESC";
  if (sort === "stok_asc") order = " ORDER BY stok_produk ASC";
  if (sort === "stok_desc") order = " ORDER BY stok_produk DESC";

  const [rows] = await db.query(sql + order, [`%${search}%`]);
  res.json(rows);
});

module.exports = router;
