const db = require('../db'); // atau '../db.js' sesuai lokasi file kamu

exports.getDashboard = async (req, res) => {
  try {
    // pastikan user login dan jabatannya CS
    if (!req.session.user || req.session.user.jabatan !== 'CS') {
      req.flash('error_msg', 'Akses ditolak. Anda bukan CS.');
      return res.redirect('/');
    }

    // ambil data customer & hewan
    const [customers] = await db.query('SELECT * FROM customer');
    const [hewan] = await db.query(`
      SELECT h.*, c.nama_customer 
      FROM hewan h
      JOIN customer c ON h.id_customer = c.id_customer
    `);

    res.render('cs', {
      title: 'Dashboard CS',
      user: req.session.user,
      customers,
      hewan
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal memuat data CS');
    res.redirect('/');
  }
};
