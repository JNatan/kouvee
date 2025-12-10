const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  const { search = "", sort = "" } = req.query;

  let sql = "SELECT * FROM layanan WHERE nama_layanan LIKE ?";
  let order = "";

  if (sort === "nama") order = " ORDER BY nama_layanan ASC";
  if (sort === "harga_asc") order = " ORDER BY harga_layanan ASC";
  if (sort === "harga_desc") order = " ORDER BY harga_layanan DESC";

  const [rows] = await db.query(sql + order, [`%${search}%`]);
  res.json(rows);
});

module.exports = router;
