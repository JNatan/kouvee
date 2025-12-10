const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    // pastikan user login dan jabatannya OWNER
    if (!req.session.user || req.session.user.jabatan.toUpperCase() !== 'OWNER') {
      req.flash('error_msg', 'Akses ditolak. Anda bukan OWNER.');
      return res.redirect('/');
    }

    const [pegawai] = await db.query('SELECT * FROM pegawai');
    const [produk] = await db.query('SELECT * FROM produk');
    const [layanan] = await db.query('SELECT * FROM layanan');

    res.render('owner', {
      title: 'Dashboard Owner',
      user: req.session.user,
      pegawai,
      produk,
      layanan,
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal memuat data Owner');
    res.redirect('/');
  }
};