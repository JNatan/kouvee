const express = require("express");
const router = express.Router();
const db = require("../db");
const PDFDocument = require('pdfkit');

/* ===========================================================
   ===============   HALAMAN UTAMA LAPORAN   ==================
   =========================================================== */
router.get("/", async (req, res) => {
  const tahun = new Date().getFullYear();
  const bulan = new Date().getMonth() + 1;

  try {
    // === Query Produk Terlaris ===
    const [produkTerlaris] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan, p.nama_produk,
             SUM(dp.jumlah) AS jumlah
      FROM detail_transaksi_produk dp
      JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
      JOIN produk p ON dp.id_produk = p.id_produk
      GROUP BY bulan, p.nama_produk
      ORDER BY bulan ASC, jumlah DESC;
    `);

    // === Query Layanan Terlaris ===
    const [layananTerlaris] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan, l.nama_layanan,
             COUNT(dl.id_layanan) AS jumlah
      FROM detail_transaksi_layanan dl
      JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
      JOIN layanan l ON dl.id_layanan = l.id_layanan
      GROUP BY bulan, l.nama_layanan
      ORDER BY bulan ASC, jumlah DESC;
    `);

    // === Pendapatan Tahunan ===
    const [pendapatanTahunan] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan,
             SUM(dp.subtotal) AS jasa_layanan,
             SUM(dl.subtotal) AS produk,
             (SUM(dp.subtotal) + SUM(dl.subtotal)) AS total
      FROM transaksi t
      LEFT JOIN detail_transaksi_produk dp ON dp.id_transaksi = t.id_transaksi
      LEFT JOIN detail_transaksi_layanan dl ON dl.id_transaksi = t.id_transaksi
      GROUP BY bulan
      ORDER BY bulan ASC;
    `);

    // === Pendapatan Bulanan (Layanan) ===
    const [pendapatanBulananLayanan] = await db.query(`
      SELECT l.nama_layanan, SUM(dl.subtotal) AS harga
      FROM detail_transaksi_layanan dl
      JOIN layanan l ON dl.id_layanan = l.id_layanan
      JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
      WHERE MONTH(t.tanggal_transaksi) = ?
      GROUP BY l.nama_layanan;
    `, [bulan]);

    // === Pendapatan Bulanan (Produk) ===
    const [pendapatanBulananProduk] = await db.query(`
      SELECT p.nama_produk, SUM(dp.subtotal) AS harga
      FROM detail_transaksi_produk dp
      JOIN produk p ON dp.id_produk = p.id_produk
      JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
      WHERE MONTH(t.tanggal_transaksi) = ?
      GROUP BY p.nama_produk;
    `, [bulan]);

    res.render("laporan", {
      produkTerlaris,
      layananTerlaris,
      pendapatanTahunan,
      pendapatanBulananLayanan,
      pendapatanBulananProduk,
      bulan,
      tahun
    });

  } catch (err) {
    res.status(500).send("Terjadi kesalahan pada server: " + err.message);
  }
});

/* ===========================================================
   ===============        DOWNLOAD PDF          ===============
   =========================================================== */
router.get("/download", async (req, res) => {
  const tahun = new Date().getFullYear();
  const bulan = new Date().getMonth() + 1;

  // Nama bulan
  const namaBulan = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  try {
    /* ----------------------- QUERY SEMUA DATA ---------------------- */
    const [produkTerlaris] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan, p.nama_produk,
             SUM(dp.jumlah) AS jumlah
      FROM detail_transaksi_produk dp
      JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
      JOIN produk p ON dp.id_produk = p.id_produk
      GROUP BY bulan, p.nama_produk
      ORDER BY bulan ASC, jumlah DESC;
    `);

    const [layananTerlaris] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan, l.nama_layanan,
             COUNT(dl.id_layanan) AS jumlah
      FROM detail_transaksi_layanan dl
      JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
      JOIN layanan l ON dl.id_layanan = l.id_layanan
      GROUP BY bulan, l.nama_layanan
      ORDER BY bulan ASC, jumlah DESC;
    `);

    const [pendapatanTahunan] = await db.query(`
      SELECT MONTH(t.tanggal_transaksi) AS bulan,
             SUM(dp.subtotal) AS jasa_layanan,
             SUM(dl.subtotal) AS produk,
             (SUM(dp.subtotal) + SUM(dl.subtotal)) AS total
      FROM transaksi t
      LEFT JOIN detail_transaksi_produk dp ON dp.id_transaksi = t.id_transaksi
      LEFT JOIN detail_transaksi_layanan dl ON dl.id_transaksi = t.id_transaksi
      GROUP BY bulan
      ORDER BY bulan ASC;
    `);

    const [pendapatanBulananLayanan] = await db.query(`
      SELECT l.nama_layanan, SUM(dl.subtotal) AS harga
      FROM detail_transaksi_layanan dl
      JOIN layanan l ON dl.id_layanan = l.id_layanan
      JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
      WHERE MONTH(t.tanggal_transaksi) = ?
      GROUP BY l.nama_layanan;
    `, [bulan]);

    const [pendapatanBulananProduk] = await db.query(`
      SELECT p.nama_produk, SUM(dp.subtotal) AS harga
      FROM detail_transaksi_produk dp
      JOIN produk p ON dp.id_produk = p.id_produk
      JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
      WHERE MONTH(t.tanggal_transaksi) = ?
      GROUP BY p.nama_produk;
    `, [bulan]);

    /* ----------------------- MULAI BIKIN PDF ---------------------- */
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=laporan_kouvee.pdf");
    doc.pipe(res);

    const addSectionTitle = (title) => {
      doc.moveDown().fontSize(18).text(title, { align: "center" });
      doc.moveDown(0.5);
    };

    const addTableHeader = (headers) => {
      doc.fontSize(12).font("Helvetica-Bold").text(headers.join(" | "));
      doc.font("Helvetica").moveDown(0.2);
    };

    const addTableRow = (cells) => {
      doc.text(cells.join(" | "));
    };

    /* ========= 1. PRODUK TERLARIS ========= */
    addSectionTitle(`Laporan Produk Terlaris – Tahun ${tahun}`);
    addTableHeader(["No", "Bulan", "Nama Produk", "Jumlah"]);
    produkTerlaris.forEach((p, i) =>
      addTableRow([i + 1, namaBulan[p.bulan], p.nama_produk, p.jumlah])
    );

    /* ========= 2. LAYANAN TERLARIS ========= */
    addSectionTitle(`Laporan Layanan Terlaris – Tahun ${tahun}`);
    addTableHeader(["No", "Bulan", "Nama Layanan", "Jumlah"]);
    layananTerlaris.forEach((l, i) =>
      addTableRow([i + 1, namaBulan[l.bulan], l.nama_layanan, l.jumlah])
    );

    /* ========= 3. PENDAPATAN TAHUNAN ========= */
    addSectionTitle(`Laporan Pendapatan Tahunan – Tahun ${tahun}`);
    addTableHeader(["No", "Bulan", "Layanan", "Produk", "Total"]);
    pendapatanTahunan.forEach((t, i) =>
      addTableRow([
        i + 1,
        namaBulan[t.bulan],
        `Rp ${t.jasa_layanan?.toLocaleString() || 0}`,
        `Rp ${t.produk?.toLocaleString() || 0}`,
        `Rp ${t.total?.toLocaleString() || 0}`
      ])
    );

    /* ========= 4. PENDAPATAN BULANAN ========= */
    addSectionTitle(`Pendapatan Bulanan – ${namaBulan[bulan]} ${tahun}`);
    
    // ---- Layanan ----
    doc.font("Helvetica-Bold").text("\nJasa Layanan\n");
    addTableHeader(["No", "Nama Layanan", "Harga"]);
    pendapatanBulananLayanan.forEach((item, i) =>
      addTableRow([
        i + 1,
        item.nama_layanan,
        `Rp ${item.harga?.toLocaleString() || 0}`
      ])
    );

    // ---- Produk ----
    doc.font("Helvetica-Bold").text("\nProduk\n");
    addTableHeader(["No", "Nama Produk", "Harga"]);
    pendapatanBulananProduk.forEach((item, i) =>
      addTableRow([
        i + 1,
        item.nama_produk,
        `Rp ${item.harga?.toLocaleString() || 0}`
      ])
    );

    /* ----------------------- SELESAI ---------------------- */
    doc.end();

  } catch (err) {
    res.status(500).send("Gagal membuat PDF: " + err.message);
  }
});

module.exports = router;
