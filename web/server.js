const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(flash());

// locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// routes
const authRoutes = require('./src/routes/auth');

const csRoutes = require('./src/routes/cs');
app.use('/cs', csRoutes);

const ownerRoutes = require('./src/routes/owner');
app.use('/owner', ownerRoutes);

// const kasirRoutes = require('./src/routes/kasir');
// app.use('/kasir', kasirRoutes);

/*
app.get('/owner', (req, res) => {
  res.send(`<h1>Selamat datang Owner, ${req.session.user?.nama_pegawai || ''}</h1>`);
});
/*/

// app.get('/kasir', (req, res) => {
//   res.send(`<h1>Selamat datang Kasir, ${req.session.user?.nama_pegawai || ''}</h1>`);
// });

app.get('/cs', (req, res) => {
  res.send(`<h1>Selamat datang CS, ${req.session.user?.nama_pegawai || ''}</h1>`);
});

const customerRoutes = require('./src/routes/customer');
const hewanRoutes = require('./src/routes/hewan');
const pegawaiRoutes = require('./src/routes/pegawai');
const produkRoutes = require('./src/routes/produk');
const layananRoutes = require('./src/routes/layanan');

const pembayaranRoutes = require('./src/routes/pembayaran');

const transaksiProdukRoutes = require('./src/routes/transaksiProduk');
const transaksiLayananRoutes = require('./src/routes/transaksiLayanan');

const lunasRoutes = require('./src/routes/lunas');
app.use('/lunas', lunasRoutes);


app.use('/transaksi-produk', transaksiProdukRoutes);
app.use('/transaksi-layanan', transaksiLayananRoutes);

app.use('/pembayaran', pembayaranRoutes);

app.get('/', (req, res) => {
  res.render('landing');
});

app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/hewans', hewanRoutes);
app.use('/pegawai', pegawaiRoutes);
app.use('/produk', produkRoutes);
app.use('/layanan', layananRoutes);
app.use("/laporan", require("./src/routes/laporan"));

const authApi = require('./src/routes/api/authApi');
app.use('/api/auth', authApi);

const customerApi = require('./src/routes/api/customerApi');
app.use('/api/customer', customerApi);

const hewanApi = require('./src/routes/api/hewanApi');
app.use('/api/hewan', hewanApi);

const produkApi = require('./src/routes/api/produkApi');
app.use('/api/produk', produkApi);

const layananApi = require('./src/routes/api/layananApi');
app.use('/api/layanan', layananApi);

app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
