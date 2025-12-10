const db = require('../db');

// ===============================
// LIST TRANSAKSI LAYANAN
// ===============================
exports.list = async (req, res) => {
  const status = req.query.status || '';

  let sql = `
    SELECT 
      t.id_transaksi, 
      t.tanggal_transaksi, 
      t.total, 
      c.nama_customer, 
      p.nama_pegawai, 
      sh.status_pelayanan
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    JOIN pegawai p ON t.id_pegawai = p.id_pegawai
    LEFT JOIN detail_transaksi_layanan dtl ON t.id_transaksi = dtl.id_transaksi
    LEFT JOIN hewan h ON dtl.id_hewan = h.id_hewan
    LEFT JOIN status_hewan sh ON sh.id_hewan = h.id_hewan
    WHERE t.jenis_transaksi = 'Layanan'
  `;

  const params = [];
  if (status) {
    sql += ' AND sh.status_pelayanan = ?';
    params.push(status);
  }

  sql += ' GROUP BY t.id_transaksi ORDER BY t.id_transaksi DESC';

  try {
    const [rows] = await db.query(sql, params);
    res.render('transaksiLayanan/list', { transaksi: rows, status });
  } catch (err) {
    console.error('❌ Gagal memuat data transaksi layanan:', err);
    req.flash('error_msg', 'Gagal memuat data transaksi layanan');
    res.redirect('/');
  }
};

// ===============================
// FORM TAMBAH TRANSAKSI
// ===============================
exports.createForm = async (req, res) => {
  try {
    const [customers] = await db.query("SELECT * FROM customer");
    const [hewan] = await db.query("SELECT * FROM hewan");
    const [layanan] = await db.query("SELECT * FROM layanan");

    console.log("DEBUG customers:", customers.length);
    console.log("DEBUG hewan:", hewan.length);
    console.log("DEBUG layanan:", layanan.length);
    console.log("DEBUG user:", req.session.user);

    res.render("transaksiLayanan/form", {
      transaksi: null,
      customers,
      hewan,
      layanan,
      hewanJSON: Buffer.from(JSON.stringify(hewan)).toString("base64"),
      layananJSON: Buffer.from(JSON.stringify(layanan)).toString("base64"),
      detail: null,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal membuka form transaksi layanan");
    res.redirect("/transaksi-layanan");
  }
};


// ===============================
// TAMBAH TRANSAKSI BARU
// ===============================
exports.create = async (req, res) => {
  try {
    // 1. simpan ke tabel transaksi
    const [trxRes] = await db.query(
      `INSERT INTO transaksi 
        (id_customer, id_pegawai, jenis_transaksi, tanggal_transaksi, total, status_pembayaran, diskon)
       VALUES (?, ?, 'Layanan', NOW(), ?, 0, 0)`,
      [req.body.id_customer, req.body.id_pegawai, req.body.total || 0]
    );

    const id_transaksi = trxRes.insertId;

    // 2. simpan detail layanan
    const layananList = req.body.layanan_id;
    const hewan_id = req.body.id_hewan;

    if (Array.isArray(layananList)) {
      for (let id of layananList) {
        await db.query(
          `INSERT INTO detail_transaksi_layanan (id_transaksi, id_layanan, id_hewan)
           VALUES (?, ?, ?)`,
          [id_transaksi, id, hewan_id]
        );
      }
    } else {
      // kalau hanya 1 layanan
      await db.query(
        `INSERT INTO detail_transaksi_layanan (id_transaksi, id_layanan, id_hewan)
         VALUES (?, ?, ?)`,
        [id_transaksi, layananList, hewan_id]
      );
    }

    req.flash('success_msg', 'Transaksi layanan berhasil ditambahkan');
    res.redirect('/transaksi-layanan');

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal menambahkan transaksi layanan');
    res.redirect('/transaksi-layanan');
  }
};

// ===============================
// VIEW DETAIL TRANSAKSI
// ===============================
exports.view = async (req, res) => {
  const id = req.params.id;
  try {
    const [trx] = await db.query(`
      SELECT 
        t.*, 
        c.nama_customer, 
        p.nama_pegawai,
        h.nama_hewan,
        sh.status_pelayanan
      FROM transaksi t
      JOIN customer c ON t.id_customer = c.id_customer
      JOIN pegawai p ON t.id_pegawai = p.id_pegawai
      LEFT JOIN detail_transaksi_layanan dtl ON t.id_transaksi = dtl.id_transaksi
      LEFT JOIN hewan h ON dtl.id_hewan = h.id_hewan
      LEFT JOIN status_hewan sh ON sh.id_hewan = h.id_hewan
      WHERE t.id_transaksi = ?
      GROUP BY t.id_transaksi
    `, [id]);

    const [detail] = await db.query(`
      SELECT d.*, l.nama_layanan 
      FROM detail_transaksi_layanan d
      JOIN layanan l ON d.id_layanan = l.id_layanan
      WHERE d.id_transaksi = ?`, [id]);

    res.render('transaksiLayanan/view', { transaksi: trx[0], detail });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal memuat detail transaksi');
    res.redirect('/transaksi-layanan');
  }
};

exports.editForm = async (req, res) => {
  try {
    const id = req.params.id;

    const [transaksi] = await db.query(
      "SELECT * FROM transaksi WHERE id_transaksi = ?", 
      [id]
    );

    const [customers] = await db.query("SELECT * FROM customer");
    const [hewan] = await db.query("SELECT * FROM hewan");
    const [layanan] = await db.query("SELECT * FROM layanan");

    const [detail] = await db.query(`
      SELECT * FROM detail_transaksi_layanan WHERE id_transaksi = ?
    `, [id]);

    res.render("transaksiLayanan/form", {
      transaksi: transaksi[0],
      customers,
      hewan,
      layanan,
      detail,
      hewanJSON: Buffer.from(JSON.stringify(hewan)).toString("base64"),
      layananJSON: Buffer.from(JSON.stringify(layanan)).toString("base64"),
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal membuka form edit");
    res.redirect("/transaksi-layanan");
  }
};

// ===============================
// UPDATE TRANSAKSI LAYANAN
// ===============================
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // Update transaksi utama
    await db.query(
      `UPDATE transaksi 
       SET id_customer = ?, id_pegawai = ?, total = ?, status_pembayaran = 0
       WHERE id_transaksi = ?`,
      [req.body.id_customer, req.body.id_pegawai, req.body.total, id]
    );

    // Hapus detail lama lalu insert ulang
    await db.query("DELETE FROM detail_transaksi_layanan WHERE id_transaksi = ?", [id]);

    const layananList = req.body.layanan_id;
    const hewan_id = req.body.id_hewan;

    // Insert ulang detail layanan
    if (Array.isArray(layananList)) {
      for (let layanan of layananList) {
        await db.query(
          `INSERT INTO detail_transaksi_layanan (id_transaksi, id_layanan, id_hewan)
           VALUES (?, ?, ?)`,
          [id, layanan, hewan_id]
        );
      }
    } else {
      await db.query(
        `INSERT INTO detail_transaksi_layanan (id_transaksi, id_layanan, id_hewan)
         VALUES (?, ?, ?)`,
        [id, layananList, hewan_id]
      );
    }

    // Update status (jika dikirim)
    if (req.body.status_layanan) {
      await db.query(
        `UPDATE status_hewan
         SET status_pelayanan = ?, tanggal_update = NOW()
         WHERE id_hewan = ?`,
        [req.body.status_layanan, hewan_id]
      );
    }

    req.flash("success_msg", "Transaksi layanan berhasil diupdate");
    res.redirect("/transaksi-layanan");

  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Gagal mengupdate transaksi layanan");
    res.redirect("/transaksi-layanan");
  }
};




// ===============================
// UPDATE STATUS LAYANAN
// ===============================
exports.updateStatus = async (req, res) => {
  try {
    await db.query(
      'UPDATE status_hewan SET status_pelayanan = ?, tanggal_update = NOW() WHERE id_hewan = ?',
      [req.body.status_pelayanan, req.params.id]
    );
    req.flash('success_msg', 'Status pelayanan berhasil diubah');
    res.redirect('/transaksi-layanan');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal mengubah status layanan');
    res.redirect('/transaksi-layanan');
  }
};
