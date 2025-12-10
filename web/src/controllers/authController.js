const bcrypt = require('bcrypt');
const db = require('../db');

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT u.*, p.nama_pegawai, p.jabatan
      FROM user u
      JOIN pegawai p ON u.id_pegawai = p.id_pegawai
      WHERE u.username = ?
    `, [username]);

    if (rows.length === 0) {
      req.flash('error_msg', 'Username tidak ditemukan');
      return res.redirect('/');
    }

    const user = rows[0];

    if (password !== user.password) {
      req.flash('error_msg', 'Password salah');
      return res.redirect('/');
    }

    // simpan user ke session
    req.session.user = {
      id_user: user.id_user,
      id_pegawai: user.id_pegawai,
      username: user.username,
      nama_pegawai: user.nama_pegawai,
      jabatan: user.jabatan
    };

    console.log("SESSION USER:", req.session.user); // <---- DEBUG

    req.flash('success_msg', `Selamat datang, ${user.nama_pegawai} (${user.jabatan})`);

    // simpan session, lalu redirect (hanya sekali!)
    req.session.save(() => {
      const role = user.jabatan.toUpperCase();

      if (role === 'OWNER') {
        return res.redirect('/pegawai');
      } else if (role === 'KASIR') {
        return res.redirect('/pembayaran');
      } else if (role === 'CS') {
        return res.redirect('/customers');
      } else {
        return res.redirect('/');
      }
    });

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan pada server');
    return res.redirect('/');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

exports.ensureAuth = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error_msg', 'Silakan login terlebih dahulu');
  res.redirect('/');
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Silakan login terlebih dahulu.');
      return res.redirect('/');
    }

    const userRole = req.session.user.jabatan.toUpperCase();
    const allowed = roles.map(r => r.toUpperCase());

    if (!allowed.includes(userRole)) {
      req.flash('error_msg', 'Akses ditolak.');
      return res.redirect('/');
    }

    next();
  };
};





/*
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT u.*, p.nama_pegawai, p.jabatan
      FROM user u
      JOIN pegawai p ON u.id_pegawai = p.id_pegawai
      WHERE u.username = ?
    `, [username]);

    if (rows.length === 0) {
      req.flash('error_msg', 'Username tidak ditemukan');
      return res.redirect('/');
    }

    const user = rows[0];

    // Password belum di-hash di database, jadi bandingkan langsung dulu
    if (password !== user.password) {
      req.flash('error_msg', 'Password salah');
      return res.redirect('/');
    }

    req.session.user = {
      id_user: user.id_user,
      username: user.username,
      nama_pegawai: user.nama_pegawai,
      jabatan: user.jabatan
    };

    req.flash('success_msg', `Selamat datang, ${user.nama_pegawai} (${user.jabatan})`);

    // Redirect sesuai jabatan
    if (user.jabatan === 'OWNER') return res.redirect('/owner');
    if (user.jabatan === 'KASIR') return res.redirect('/kasir');
    if (user.jabatan === 'CS') return res.redirect('/customers');

    req.session.save(() => {
      const role = user.jabatan.toUpperCase();

      if (role === 'OWNER') return res.redirect('/owner');
      if (role === 'KASIR') return res.redirect('/kasir');
      if (role === 'CS') return res.redirect('/customers');

      return res.redirect('/');
    });

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Terjadi kesalahan pada server');
    return res.redirect('/');
  }
};
*/
