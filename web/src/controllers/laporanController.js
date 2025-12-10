const db = require('../db');

// 1. Produk Terlaris
exports.produkTerlaris = (req, res) => {
    const sql = `
        SELECT MONTH(t.tanggal_transaksi) AS bulan, p.nama_produk,
               SUM(dp.jumlah) AS jumlah_penjualan
        FROM detail_transaksi_produk dp
        JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
        JOIN produk p ON dp.id_produk = p.id_produk
        GROUP BY bulan, p.nama_produk
        ORDER BY bulan ASC, jumlah_penjualan DESC;
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("laporan/produk", { data: result });
    });
};

// 2. Layanan Terlaris
exports.layananTerlaris = (req, res) => {
    const sql = `
        SELECT MONTH(t.tanggal_transaksi) AS bulan, l.nama_layanan,
               COUNT(dl.id_layanan) AS jumlah_penjualan
        FROM detail_transaksi_layanan dl
        JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
        JOIN layanan l ON dl.id_layanan = l.id_layanan
        GROUP BY bulan, l.nama_layanan
        ORDER BY bulan ASC, jumlah_penjualan DESC;
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("laporan/layanan", { data: result });
    });
};

// 3. Pendapatan Tahunan
exports.pendapatanTahunan = (req, res) => {
    const sql = `
        SELECT MONTH(t.tanggal_transaksi) AS bulan,
               SUM(dp.subtotal) AS total_produk,
               SUM(dl.subtotal) AS total_layanan,
               (SUM(dp.subtotal) + SUM(dl.subtotal)) AS total_pendapatan
        FROM transaksi t
        LEFT JOIN detail_transaksi_produk dp ON dp.id_transaksi = t.id_transaksi
        LEFT JOIN detail_transaksi_layanan dl ON dl.id_transaksi = t.id_transaksi
        GROUP BY bulan
        ORDER BY bulan ASC;
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("laporan/tahunan", { data: result });
    });
};

// 4. Pendapatan Bulanan
exports.pendapatanBulanan = (req, res) => {
    const bulan = req.query.bulan;

    const sqlLayanan = `
        SELECT l.nama_layanan, SUM(dl.subtotal) AS total
        FROM detail_transaksi_layanan dl
        JOIN layanan l ON dl.id_layanan = l.id_layanan
        JOIN transaksi t ON dl.id_transaksi = t.id_transaksi
        WHERE MONTH(t.tanggal_transaksi) = ?
        GROUP BY l.nama_layanan;
    `;

    const sqlProduk = `
        SELECT p.nama_produk, SUM(dp.subtotal) AS total
        FROM detail_transaksi_produk dp
        JOIN produk p ON dp.id_produk = p.id_produk
        JOIN transaksi t ON dp.id_transaksi = t.id_transaksi
        WHERE MONTH(t.tanggal_transaksi) = ?
        GROUP BY p.nama_produk;
    `;

    db.query(sqlLayanan, [bulan], (err, layanan) => {
        if (err) throw err;

        db.query(sqlProduk, [bulan], (err, produk) => {
            if (err) throw err;
            res.render("laporan/bulanan", { layanan, produk, bulan });
        });
    });
};
