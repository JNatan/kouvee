const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pembayaranController');
const auth = require('../controllers/authController');

// ==============================
// LIST TRANSAKSI BELUM LUNAS
// ==============================
router.get('/', auth.restrictTo("KASIR"), ctrl.list);

// ==============================
// VIEW DETAIL TRANSAKSI
// ==============================
router.get('/view/:id', auth.restrictTo("KASIR"), ctrl.viewDetail);

// ==============================
// FORM PEMBAYARAN
// ==============================
router.get('/bayar/:id', auth.restrictTo("KASIR"), ctrl.form);

// PROSES PEMBAYARAN
router.post('/bayar/:id', auth.restrictTo("KASIR"), ctrl.pay);

// ==============================
// EDIT ITEM TRANSAKSI
// ==============================
router.get('/edit/:id', auth.restrictTo("KASIR"), ctrl.editForm);
router.post('/edit/:id', auth.restrictTo("KASIR"), ctrl.updateItems);

module.exports = router;
