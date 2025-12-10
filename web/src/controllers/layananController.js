const Layanan = require('../models/layananModel');

exports.index = async (req, res) => {
  const q = req.query.q || '';
  const layananList = await Layanan.findAll(q);
  res.render('layanan/list', { layanan: layananList, q });
};

exports.showCreate = (req, res) => {
  res.render('layanan/form', { layanan: null });
};

exports.create = async (req, res) => {
  try {
    await Layanan.create(req.body);
    req.flash('success_msg', 'Layanan berhasil ditambahkan');
    res.redirect('/layanan');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal menambahkan layanan');
    res.redirect('/layanan');
  }
};

exports.showEdit = async (req, res) => {
  const id = req.params.id;
  const layanan = await Layanan.findById(id);
  res.render('layanan/form', { layanan });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Layanan.update(id, req.body);
  req.flash('success_msg', 'Layanan berhasil diupdate');
  res.redirect('/layanan');
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Layanan.delete(id);
  req.flash('success_msg', 'Layanan berhasil dihapus');
  res.redirect('/layanan');
};

exports.view = async (req, res) => {
  const id = req.params.id;
  const layanan = await Layanan.findById(id);
  res.render('layanan/view', { layanan });
};
