const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    // Validasi role user
    if (!req.session.user || req.session.user.jabatan.toUpperCase() !== 'KASIR') {
      req.flash('error_msg', 'Akses ditolak. Anda bukan KASIR.');
      return res.redirect('/');
    }

    // Ambil transaksi yang BELUM lunas
    const [transaksi] = await db.query(`
      SELECT 
        t.id_transaksi,
        t.tanggal_transaksi,
        t.jenis_transaksi,
        t.total_asli,
        t.total,
        t.diskon,
        t.status_pembayaran,
        c.nama_customer,
        p.nama_pegawai
      FROM transaksi t
      JOIN customer c ON t.id_customer = c.id_customer
      JOIN pegawai p ON t.id_pegawai = p.id_pegawai
      WHERE t.status_pembayaran = 0
      ORDER BY t.id_transaksi ASC
    `);

    res.render('kasir', {
      title: 'Dashboard Kasir',
      user: req.session.user,
      transaksi
    });

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal memuat data Kasir');
    res.redirect('/');
  }
};
