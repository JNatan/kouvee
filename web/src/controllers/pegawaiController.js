const Pegawai = require('../models/pegawaiModel');

exports.index = async (req, res) => {
  const q = req.query.q || '';
  const pegawaiList = await Pegawai.findAll(q);
  res.render('pegawai/list', { pegawai: pegawaiList, q });
};

exports.showCreate = (req, res) => {
  res.render('pegawai/form', { pegawai: null });
};

exports.create = async (req, res) => {
  try {
    await Pegawai.create(req.body);
    req.flash('success_msg', 'Pegawai berhasil ditambahkan');
    res.redirect('/pegawai');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Gagal menambahkan pegawai');
    res.redirect('/pegawai');
  }
};

exports.showEdit = async (req, res) => {
  const id = req.params.id;
  const pegawai = await Pegawai.findById(id);
  res.render('pegawai/form', { pegawai });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Pegawai.update(id, req.body);
  req.flash('success_msg', 'Pegawai berhasil diupdate');
  res.redirect('/pegawai');
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Pegawai.delete(id);
  req.flash('success_msg', 'Pegawai berhasil dihapus');
  res.redirect('/pegawai');
};

exports.view = async (req, res) => {
  const id = req.params.id;
  const pegawai = await Pegawai.findById(id);
  res.render('pegawai/view', { pegawai });
};
