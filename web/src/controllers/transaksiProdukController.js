const db = require('../db');

// ================= LIST SEMUA TRANSAKSI PRODUK ===================
exports.list = async (req, res) => {
  const [rows] = await db.query(`
    SELECT t.id_transaksi, t.tanggal_transaksi, t.total, c.nama_customer, p.nama_pegawai
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    JOIN pegawai p ON t.id_pegawai = p.id_pegawai
    WHERE t.jenis_transaksi = 'Produk'
    ORDER BY t.id_transaksi DESC
  `);

  res.render('transaksiProduk/list', { transaksi: rows });
};

// ================= FORM TAMBAH TRANSAKSI PRODUK ===================
exports.createForm = async (req, res) => {
  // ambil daftar customer dan produk
  const [customers] = await db.query("SELECT * FROM customer ORDER BY nama_customer ASC");
  const [produk] = await db.query("SELECT * FROM produk ORDER BY nama_produk ASC");

  res.render('transaksiProduk/form', {
    transaksi: null,
    customers,
    produk,
    detail: [],
    user: req.session.user      // penting: untuk otomatis isi pegawai
  });
};

exports.create = async (req, res) => {
  try {
    const { id_customer, id_pegawai, total } = req.body;

    // ambil array produk & jumlah
    const produkList = Array.isArray(req.body.produk_id) ? req.body.produk_id : [req.body.produk_id];
    const jumlahList = Array.isArray(req.body.jumlah) ? req.body.jumlah : [req.body.jumlah];

    // 1. SIMPAN TRANSAKSI
    const [trx] = await db.query(`
      INSERT INTO transaksi 
      (tanggal_transaksi, jenis_transaksi, total, status_pembayaran, diskon, id_customer, id_pegawai)
      VALUES (NOW(), 'Produk', ?, 0, 0, ?, ?)
    `, [total, id_customer, id_pegawai]);

    const id_transaksi = trx.insertId;

    // 2. SIMPAN DETAIL
    for (let i = 0; i < produkList.length; i++) {
      const [p] = await db.query("SELECT harga_produk FROM produk WHERE id_produk = ?", [produkList[i]]);

      const subtotal = p[0].harga_produk * jumlahList[i];

      await db.query(`
        INSERT INTO detail_transaksi_produk (id_transaksi, id_produk, jumlah, subtotal)
        VALUES (?, ?, ?, ?)
      `, [id_transaksi, produkList[i], jumlahList[i], subtotal]);
    }

    req.flash("success_msg", "Transaksi produk berhasil ditambahkan");
    res.redirect("/transaksi-produk");

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal menambahkan transaksi produk");
    res.redirect("/transaksi-produk/create");
  }
};

// ================= FORM EDIT (TIDAK DIPAKAI UNTUK DETAIL PRODUK) ===================
exports.editForm = async (req, res) => {
  const id = req.params.id;

  // Ambil transaksi utama
  const [trx] = await db.query("SELECT * FROM transaksi WHERE id_transaksi = ?", [id]);

  // Ambil detail transaksi (produk + jumlah)
  const [detail] = await db.query(`
    SELECT d.*, p.nama_produk, p.harga_produk
    FROM detail_transaksi_produk d
    JOIN produk p ON d.id_produk = p.id_produk
    WHERE d.id_transaksi = ?
  `, [id]);

  // Ambil customer dan produk untuk dropdown
  const [customers] = await db.query("SELECT * FROM customer ORDER BY nama_customer ASC");
  const [produk] = await db.query("SELECT * FROM produk ORDER BY nama_produk ASC");

  res.render("transaksiProduk/form", {
    transaksi: trx[0],
    detail,           // <-- PENTING!
    customers,
    produk,
    user: req.session.user
  });
};


// ================= UPDATE TRANSAKSI ===================
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const produkList = Array.isArray(req.body.produk_id) ? req.body.produk_id : [req.body.produk_id];
    const jumlahList = Array.isArray(req.body.jumlah) ? req.body.jumlah : [req.body.jumlah];

    // Update transaksi utama
    await db.query(`
      UPDATE transaksi
      SET id_customer=?, id_pegawai=?, total=?, total_asli=?
      WHERE id_transaksi=?
    `, [req.body.id_customer, req.body.id_pegawai, req.body.total, req.body.total, id]);

    // Hapus detail lama
    await db.query("DELETE FROM detail_transaksi_produk WHERE id_transaksi = ?", [id]);

    // Simpan ulang detail
    for (let i = 0; i < produkList.length; i++) {
      await db.query(`
        INSERT INTO detail_transaksi_produk (id_transaksi, id_produk, jumlah)
        VALUES (?, ?, ?)
      `, [id, produkList[i], jumlahList[i]]);
    }

    req.flash("success_msg", "Berhasil update transaksi produk!");
    res.redirect("/transaksi-produk");

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal update transaksi produk");
    res.redirect("/transaksi-produk");
  }
};


// ================= VIEW DETAIL ===================
exports.view = async (req, res) => {
  const id = req.params.id;

  const [trx] = await db.query(`
    SELECT t.*, c.nama_customer, p.nama_pegawai
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    JOIN pegawai p ON t.id_pegawai = p.id_pegawai
    WHERE t.id_transaksi = ?
  `, [id]);

  const [detail] = await db.query(`
    SELECT d.*, pr.nama_produk, pr.harga_produk
    FROM detail_transaksi_produk d
    JOIN produk pr ON d.id_produk = pr.id_produk
    WHERE d.id_transaksi = ?
  `, [id]);

  res.render('transaksiProduk/view', { transaksi: trx[0], detail });
};
