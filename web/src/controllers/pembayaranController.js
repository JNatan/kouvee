const db = require('../db');

/* =========================================================
   LIST TRANSAKSI BELUM LUNAS
========================================================= */
exports.list = async (req, res) => {
  const [rows] = await db.query(`
    SELECT t.*, 
           (t.total - t.diskon) AS total_setelah_diskon,
           c.nama_customer,
           p.nama_pegawai
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    JOIN pegawai p ON t.id_pegawai = p.id_pegawai
    WHERE t.status_pembayaran = 0
    ORDER BY t.id_transaksi ASC
  `);

  res.render("pembayaran/list", { transaksi: rows });
};


/* =========================================================
   FORM PEMBAYARAN
========================================================= */
exports.form = async (req, res) => {
  const id = req.params.id;

  const [[trx]] = await db.query(`
    SELECT t.*,
           (t.total - t.diskon) AS total_setelah_diskon,
           c.nama_customer
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    WHERE id_transaksi = ?
  `, [id]);

  const [detail_produk] = await db.query(`
    SELECT dp.*, p.nama_produk, p.harga_produk
    FROM detail_transaksi_produk dp
    JOIN produk p ON dp.id_produk = p.id_produk
    WHERE dp.id_transaksi = ?
  `, [id]);

  const [detail_layanan] = await db.query(`
    SELECT dl.*, l.nama_layanan, l.harga_layanan
    FROM detail_transaksi_layanan dl
    JOIN layanan l ON dl.id_layanan = l.id_layanan
    WHERE dl.id_transaksi = ?
  `, [id]);

  res.render("pembayaran/form", { trx, detail_produk, detail_layanan });
};


/* =========================================================
   PROSES PEMBAYARAN
========================================================= */
exports.pay = async (req, res) => {
  const id = req.params.id;
  let { jumlah_bayar, diskon } = req.body;

  jumlah_bayar = parseInt(jumlah_bayar || 0);
  diskon = parseInt(diskon || 0);

  // Ambil transaksi
  const [[trx]] = await db.query(`SELECT total, diskon, bayar_total FROM transaksi WHERE id_transaksi = ?`, [id]);
  if (!trx) {
    req.flash("error_msg", "Transaksi tidak ditemukan");
    return res.redirect("/pembayaran");
  }

  const total_bayar_lama = trx.bayar_total || 0;

  // Hitung total produk & layanan
  const [[sumProduk]] = await db.query(`
    SELECT COALESCE(SUM(p.harga_produk * dp.jumlah),0) AS total_produk
    FROM detail_transaksi_produk dp
    JOIN produk p ON dp.id_produk = p.id_produk
    WHERE dp.id_transaksi = ?
  `, [id]);

  const [[sumLayanan]] = await db.query(`
    SELECT COALESCE(SUM(l.harga_layanan),0) AS total_layanan
    FROM detail_transaksi_layanan dl
    JOIN layanan l ON dl.id_layanan = l.id_layanan
    WHERE dl.id_transaksi = ?
  `, [id]);

  const total_baru = sumProduk.total_produk + sumLayanan.total_layanan;
  const total_setelah_diskon = Math.max(total_baru - diskon, 0);
  const bayar_total = total_bayar_lama + jumlah_bayar;

  // Hitung sisa total sudah termasuk diskon
  const sisa_total = Math.max(total_setelah_diskon - bayar_total, 0);

  // Status lunas
  const status = sisa_total === 0 ? 1 : 0;

  // Update transaksi
  await db.query(`
    UPDATE transaksi
    SET diskon = ?, total_setelah_diskon = ?, bayar_total = ?, sisa = ?, status_pembayaran = ?
    WHERE id_transaksi = ?
  `, [diskon, total_setelah_diskon, bayar_total, sisa_total, status, id]);

  req.flash("success_msg", "Pembayaran berhasil diproses!");
  res.redirect("/pembayaran");
};



/* =========================================================
   VIEW DETAIL TRANSAKSI
========================================================= */
exports.viewDetail = async (req, res) => {
  const id = req.params.id;

  const [[trx]] = await db.query(`
    SELECT t.*,
           (t.total - t.diskon) AS total_setelah_diskon,
           c.nama_customer,
           p.nama_pegawai
    FROM transaksi t
    JOIN customer c ON t.id_customer = c.id_customer
    JOIN pegawai p ON t.id_pegawai = p.id_pegawai
    WHERE id_transaksi = ?
  `, [id]);

  const [detail_produk] = await db.query(`
    SELECT dp.*, p.nama_produk, p.harga_produk
    FROM detail_transaksi_produk dp
    JOIN produk p ON dp.id_produk = p.id_produk
    WHERE dp.id_transaksi = ?
  `, [id]);

  const [detail_layanan] = await db.query(`
    SELECT dl.*, l.nama_layanan, l.harga_layanan
    FROM detail_transaksi_layanan dl
    JOIN layanan l ON dl.id_layanan = l.id_layanan
    WHERE dl.id_transaksi = ?
  `, [id]);

  res.render("pembayaran/view", { trx, detail_produk, detail_layanan });
};


/* =========================================================
   EDIT FORM ITEM TRANSAKSI
========================================================= */
exports.editForm = async (req, res) => {
  const id = req.params.id;

  const [[trx]] = await db.query(`SELECT * FROM transaksi WHERE id_transaksi = ?`, [id]);
  const [produk] = await db.query("SELECT * FROM produk");
  const [layanan] = await db.query("SELECT * FROM layanan");

  const [detailProduk] = await db.query(`
    SELECT dp.*, p.nama_produk, p.harga_produk
    FROM detail_transaksi_produk dp
    JOIN produk p ON dp.id_produk = p.id_produk
    WHERE dp.id_transaksi = ?
  `, [id]);

  const [detailLayanan] = await db.query(`
    SELECT dl.*, l.nama_layanan, l.harga_layanan
    FROM detail_transaksi_layanan dl
    JOIN layanan l ON dl.id_layanan = l.id_layanan
    WHERE dl.id_transaksi = ?
  `, [id]);

  res.render("pembayaran/edit", {
    trx, produk, layanan, detailProduk, detailLayanan
  });
};


/* =========================================================
   UPDATE ITEM (FINAL — FIX STATUS LUNAS)
========================================================= */
exports.updateItems = async (req, res) => {
  const id = req.params.id;

  const rowProduk = req.body["row_produk[]"];
  const produk_id = req.body["produk_id[]"];
  const jumlah = req.body["jumlah[]"];

  const rowLayanan = req.body["row_layanan[]"];
  const layanan_id = req.body["layanan_id[]"];

  // Ambil data detail lama
  const [oldProduk] = await db.query(`SELECT * FROM detail_transaksi_produk WHERE id_transaksi = ?`, [id]);
  const [oldLayanan] = await db.query(`SELECT * FROM detail_transaksi_layanan WHERE id_transaksi = ?`, [id]);

  // Hapus item yang dihapus user
  if (rowProduk) {
    const keepIndex = Array.isArray(rowProduk) ? rowProduk : [rowProduk];
    for (let old of oldProduk) {
      if (!keepIndex.includes(old.id_detail_produk.toString())) {
        await db.query(`DELETE FROM detail_transaksi_produk WHERE id_detail_produk = ?`, [old.id_detail_produk]);
      }
    }
  } else {
    for (let old of oldProduk) {
      await db.query(`DELETE FROM detail_transaksi_produk WHERE id_detail_produk = ?`, [old.id_detail_produk]);
    }
  }

  if (rowLayanan) {
    const keepIndex = Array.isArray(rowLayanan) ? rowLayanan : [rowLayanan];
    for (let old of oldLayanan) {
      if (!keepIndex.includes(old.id_detail_layanan.toString())) {
        await db.query(`DELETE FROM detail_transaksi_layanan WHERE id_detail_layanan = ?`, [old.id_detail_layanan]);
      }
    }
  } else {
    for (let old of oldLayanan) {
      await db.query(`DELETE FROM detail_transaksi_layanan WHERE id_detail_layanan = ?`, [old.id_detail_layanan]);
    }
  }

  // Insert / Update produk baru
  if (produk_id) {
    const listProduk = Array.isArray(produk_id) ? produk_id : [produk_id];
    const listJumlah = Array.isArray(jumlah) ? jumlah : [jumlah];
    const listRow = Array.isArray(rowProduk) ? rowProduk : [rowProduk];

    for (let i = 0; i < listProduk.length; i++) {
      if (!listRow[i]) continue;

      if (listRow[i] === "new") {
        await db.query(`INSERT INTO detail_transaksi_produk (id_transaksi, id_produk, jumlah) VALUES (?, ?, ?)`, [id, listProduk[i], listJumlah[i]]);
      } else {
        await db.query(`UPDATE detail_transaksi_produk SET id_produk = ?, jumlah = ? WHERE id_detail_produk = ?`, [listProduk[i], listJumlah[i], listRow[i]]);
      }
    }
  }

  // Insert / Update layanan baru
  if (layanan_id) {
    const listLayanan = Array.isArray(layanan_id) ? layanan_id : [layanan_id];
    const listRow = Array.isArray(rowLayanan) ? rowLayanan : [rowLayanan];

    for (let i = 0; i < listLayanan.length; i++) {
      if (!listRow[i]) continue;

      if (listRow[i] === "new") {
        await db.query(`INSERT INTO detail_transaksi_layanan (id_transaksi, id_layanan) VALUES (?, ?)`, [id, listLayanan[i]]);
      } else {
        await db.query(`UPDATE detail_transaksi_layanan SET id_layanan = ? WHERE id_detail_layanan = ?`, [listLayanan[i], listRow[i]]);
      }
    }
  }

  // Hitung total produk & layanan
  const [[sumProduk]] = await db.query(`
    SELECT COALESCE(SUM(p.harga_produk * dp.jumlah),0) AS total_produk
    FROM detail_transaksi_produk dp
    JOIN produk p ON dp.id_produk = p.id_produk
    WHERE dp.id_transaksi = ?
  `, [id]);

  const [[sumLayanan]] = await db.query(`
    SELECT COALESCE(SUM(l.harga_layanan),0) AS total_layanan
    FROM detail_transaksi_layanan dl
    JOIN layanan l ON dl.id_layanan = l.id_layanan
    WHERE dl.id_transaksi = ?
  `, [id]);

  const total_baru = sumProduk.total_produk + sumLayanan.total_layanan;

  // Ambil diskon & bayar_total lama
  const [[trx]] = await db.query(`SELECT diskon, bayar_total FROM transaksi WHERE id_transaksi = ?`, [id]);
  const diskon = trx.diskon || 0;
  const bayar_total = trx.bayar_total || 0;

  const total_setelah_diskon = Math.max(total_baru - diskon, 0);

  // Sisa sudah termasuk diskon
  const sisa_total = Math.max(total_setelah_diskon - bayar_total, 0);

  // Status lunas
  const status_baru = sisa_total === 0 ? 1 : 0;

  // Update transaksi utama
  await db.query(`
    UPDATE transaksi
    SET total = ?, total_setelah_diskon = ?, sisa = ?, status_pembayaran = ?
    WHERE id_transaksi = ?
  `, [total_baru, total_setelah_diskon, sisa_total, status_baru, id]);

  req.flash("success_msg", "Item transaksi berhasil diperbarui!");
  res.redirect("/pembayaran");
};
