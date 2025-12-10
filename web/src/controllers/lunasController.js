const db = require('../db');

// =======================
// LIST TRANSAKSI LUNAS
// =======================
exports.list = async (req, res) => {
  try {
    const [transaksi] = await db.query(`
      SELECT 
        t.id_transaksi,
        t.tanggal_transaksi,
        t.jenis_transaksi,
        t.total,
        t.diskon,
        t.total_setelah_diskon,
        t.bayar_total,
        t.sisa,
        c.nama_customer,
        p.nama_pegawai
      FROM transaksi t
      JOIN customer c ON t.id_customer = c.id_customer
      JOIN pegawai p ON t.id_pegawai = p.id_pegawai
      WHERE t.status_pembayaran = 1
      ORDER BY t.id_transaksi ASC
    `);

    res.render("lunas/list", {
      title: "Transaksi Lunas",
      user: req.session.user,
      transaksi
    });

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal memuat data lunas");
    res.redirect("/");
  }
};


// =======================
// VIEW DETAIL TRANSAKSI LUNAS
// =======================
exports.view = async (req, res) => {
  try {
    const id = req.params.id;

    const [[transaksi]] = await db.query(`
      SELECT 
        t.*,
        c.nama_customer,
        p.nama_pegawai
      FROM transaksi t
      JOIN customer c ON t.id_customer = c.id_customer
      JOIN pegawai p ON t.id_pegawai = p.id_pegawai
      WHERE t.id_transaksi = ?
    `, [id]);

    if (!transaksi) {
      req.flash("error_msg", "Transaksi tidak ditemukan");
      return res.redirect("/lunas");
    }

    const [detailProduk] = await db.query(`
      SELECT d.*, pr.nama_produk, pr.harga_produk
      FROM detail_transaksi_produk d
      JOIN produk pr ON d.id_produk = pr.id_produk
      WHERE d.id_transaksi = ?
    `, [id]);

    const [detailLayanan] = await db.query(`
      SELECT d.*, l.nama_layanan, l.harga_layanan
      FROM detail_transaksi_layanan d
      JOIN layanan l ON d.id_layanan = l.id_layanan
      WHERE d.id_transaksi = ?
    `, [id]);

    res.render("lunas/view", {
      title: "Detail Transaksi Lunas",
      transaksi,
      detailProduk,
      detailLayanan
    });

  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Gagal memuat detail transaksi lunas");
    res.redirect("/lunas");
  }
};

exports.print = async (req, res) => {
  try {
    const id = req.params.id;

    // Ambil transaksi + customer + pegawai + hewan
    const [[trx]] = await db.query(`
      SELECT 
        t.*,
        c.nama_customer,
        c.no_telp_customer,
        p.nama_pegawai AS kasir_name
      FROM transaksi t
      JOIN customer c ON t.id_customer = c.id_customer
      JOIN pegawai p ON t.id_pegawai = p.id_pegawai
      WHERE t.id_transaksi = ?
    `, [id]);

    if (!trx) {
      req.flash("error_msg", "Transaksi tidak ditemukan");
      return res.redirect("/lunas");
    }

    // Produk
    const [detailProduk] = await db.query(`
      SELECT d.*, p.nama_produk, p.harga_produk
      FROM detail_transaksi_produk d
      JOIN produk p ON d.id_produk = p.id_produk
      WHERE d.id_transaksi = ?
    `, [id]);

    // Layanan
    const [detailLayanan] = await db.query(`
      SELECT d.*, l.nama_layanan, l.harga_layanan
      FROM detail_transaksi_layanan d
      JOIN layanan l ON d.id_layanan = l.id_layanan
      WHERE d.id_transaksi = ?
    `, [id]);

    res.render("lunas/print", {
      trx,
      detailProduk,
      detailLayanan
    });

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal cetak struk");
    res.redirect("/lunas");
  }
};

