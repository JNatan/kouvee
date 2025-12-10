const Hewan = require('../models/hewanModel');
const Customer = require('../models/customerModel');

exports.index = async (req, res) => {
  const q = req.query.q || '';
  const hewans = await Hewan.findAll(q);
  res.render('hewan/list', { hewans, q });
};

exports.showCreate = async (req, res) => {
  const customers = await Customer.findAll();
  res.render('hewan/form', { hewan: null, customers });
};

exports.create = async (req, res) => {
  await Hewan.create(req.body);
  req.flash('success_msg', 'Hewan berhasil ditambahkan');
  res.redirect('/hewans');
};

exports.showEdit = async (req, res) => {
  const id = req.params.id;
  const hewan = await Hewan.findById(id);
  const customers = await Customer.findAll();
  res.render('hewan/form', { hewan, customers });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Hewan.update(id, req.body);
  req.flash('success_msg', 'Hewan berhasil diupdate');
  res.redirect('/hewans');
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Hewan.delete(id);
  req.flash('success_msg', 'Hewan berhasil dihapus');
  res.redirect('/hewans');
};

exports.view = async (req, res) => {
  const id = req.params.id;
  const hewan = await Hewan.findById(id);
  res.render('hewan/view', { hewan });
};
