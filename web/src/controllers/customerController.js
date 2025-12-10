const Customer = require('../models/customerModel');

exports.index = async (req, res) => {
  const q = req.query.q || '';
  const customers = await Customer.findAll(q);
  res.render('customers/list', { customers, q });
};

exports.showCreate = (req, res) => {
  res.render('customers/form', { customer: null });
};

exports.create = async (req, res) => {
  try {
    await Customer.create(req.body);
    req.flash('success_msg', 'Customer berhasil ditambahkan');
    res.redirect('/customers');
  } catch (err) {
    req.flash('error_msg', 'Gagal menambahkan customer');
    res.redirect('/customers');
  }
};

exports.showEdit = async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);
  res.render('customers/form', { customer });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Customer.update(id, req.body);
  req.flash('success_msg', 'Customer berhasil diupdate');
  res.redirect('/customers');
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Customer.delete(id);
  req.flash('success_msg', 'Customer berhasil dihapus');
  res.redirect('/customers');
};

exports.view = async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);
  res.render('customers/view', { customer });
};
