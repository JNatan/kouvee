-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 04 Nov 2025 pada 16.51
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kouvee`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `customer`
--

CREATE TABLE `customer` (
  `id_customer` int(11) NOT NULL,
  `nama_customer` varchar(255) NOT NULL,
  `alamat_customer` varchar(255) NOT NULL,
  `tanggal_lahir_customer` date NOT NULL,
  `no_telp_customer` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `customer`
--

INSERT INTO `customer` (`id_customer`, `nama_customer`, `alamat_customer`, `tanggal_lahir_customer`, `no_telp_customer`) VALUES
(1, 'Andi Pratama', 'Jl. Melati No. 12', '1995-04-12', '081234567890'),
(2, 'Budi Santoso', 'Jl. Mawar No. 45', '1990-06-20', '081298765432'),
(3, 'Citra Dewi', 'Jl. Kenanga No. 33', '1998-11-05', '081377788899'),
(4, 'Dedi Wijaya', 'Jl. Anggrek No. 21', '1985-09-15', '082134567891'),
(5, 'Eka Sari', 'Jl. Dahlia No. 8', '1992-03-25', '082145678912'),
(6, 'Farhan Hidayat', 'Jl. Cempaka No. 10', '1997-02-14', '081234567001'),
(7, 'Gita Ananda', 'Jl. Flamboyan No. 23', '1996-07-19', '081234567002'),
(8, 'Hendra Gunawan', 'Jl. Sakura No. 8', '1991-11-09', '081234567003'),
(9, 'Intan Lestari', 'Jl. Seruni No. 5', '1999-04-28', '081234567004'),
(10, 'Joko Saputra', 'Jl. Teratai No. 17', '1988-09-10', '081234567005');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_transaksi_layanan`
--

CREATE TABLE `detail_transaksi_layanan` (
  `id_detail_layanan` int(11) NOT NULL,
  `subtotal` double NOT NULL,
  `id_transaksi` int(11) NOT NULL,
  `id_layanan` int(11) NOT NULL,
  `id_hewan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_transaksi_layanan`
--

INSERT INTO `detail_transaksi_layanan` (`id_detail_layanan`, `subtotal`, `id_transaksi`, `id_layanan`, `id_hewan`) VALUES
(1, 75000, 2, 1, 1),
(2, 100000, 4, 2, 2),
(3, 120000, 5, 3, 3),
(4, 150000, 5, 4, 4),
(5, 90000, 5, 5, 5),
(6, 250000, 7, 6, 7),
(7, 100000, 8, 7, 8),
(8, 80000, 8, 8, 8),
(9, 180000, 10, 9, 10),
(10, 160000, 10, 10, 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_transaksi_produk`
--

CREATE TABLE `detail_transaksi_produk` (
  `id_detail_produk` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `subtotal` double NOT NULL,
  `id_transaksi` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_transaksi_produk`
--

INSERT INTO `detail_transaksi_produk` (`id_detail_produk`, `jumlah`, `subtotal`, `id_transaksi`, `id_produk`) VALUES
(1, 2, 100000, 1, 1),
(2, 1, 80000, 1, 2),
(3, 1, 100000, 3, 3),
(4, 2, 60000, 5, 5),
(5, 1, 30000, 5, 4),
(6, 1, 120000, 6, 6),
(7, 1, 150000, 8, 7),
(8, 2, 140000, 8, 8),
(9, 1, 50000, 9, 9),
(10, 1, 45000, 9, 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `hewan`
--

CREATE TABLE `hewan` (
  `id_hewan` int(11) NOT NULL,
  `nama_hewan` varchar(255) NOT NULL,
  `tanggal_lahir_hewan` date NOT NULL,
  `jenis_hewan` varchar(255) NOT NULL,
  `id_customer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `hewan`
--

INSERT INTO `hewan` (`id_hewan`, `nama_hewan`, `tanggal_lahir_hewan`, `jenis_hewan`, `id_customer`) VALUES
(1, 'Tommy', '2020-01-10', 'Kucing', 1),
(2, 'Rocky', '2019-06-15', 'Anjing', 2),
(3, 'Milo', '2021-02-20', 'Kucing', 3),
(4, 'Bunny', '2022-03-05', 'Kelinci', 4),
(5, 'Oscar', '2018-08-11', 'Burung', 5),
(6, 'Luna', '2020-05-12', 'Kucing', 6),
(7, 'Buddy', '2019-12-01', 'Anjing', 7),
(8, 'Chiko', '2021-07-21', 'Kelinci', 8),
(9, 'Mimi', '2022-01-09', 'Kucing', 9),
(10, 'Bobby', '2018-06-18', 'Anjing', 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `layanan`
--

CREATE TABLE `layanan` (
  `id_layanan` int(11) NOT NULL,
  `nama_layanan` varchar(255) NOT NULL,
  `deskripsi_layanan` varchar(255) NOT NULL,
  `harga_layanan` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `layanan`
--

INSERT INTO `layanan` (`id_layanan`, `nama_layanan`, `deskripsi_layanan`, `harga_layanan`) VALUES
(1, 'Grooming Kucing', 'Memandikan dan merapikan bulu kucing', 75000),
(2, 'Grooming Anjing', 'Memandikan dan merapikan bulu anjing', 100000),
(3, 'Pemeriksaan Kesehatan', 'Check-up kesehatan hewan', 120000),
(4, 'Vaksinasi', 'Pemberian vaksin lengkap', 150000),
(5, 'Konsultasi Dokter', 'Konsultasi masalah kesehatan hewan', 90000),
(6, 'Sterilisasi', 'Prosedur sterilisasi hewan peliharaan', 250000),
(7, 'Perawatan Luka', 'Membersihkan dan merawat luka hewan', 100000),
(8, 'Penitipan Harian', 'Penitipan hewan per hari', 80000),
(9, 'Pelatihan Dasar', 'Melatih perilaku dasar hewan', 180000),
(10, 'Cek Darah', 'Tes darah untuk deteksi penyakit', 160000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int(11) NOT NULL,
  `nama_pegawai` varchar(255) NOT NULL,
  `alamat_pegawai` varchar(255) NOT NULL,
  `tanggal_lahir_pegawai` date NOT NULL,
  `no_telp_pegawai` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pegawai`
--

INSERT INTO `pegawai` (`id_pegawai`, `nama_pegawai`, `alamat_pegawai`, `tanggal_lahir_pegawai`, `no_telp_pegawai`, `jabatan`) VALUES
(1, 'Jack Grealish', 'Jl. Pahlawan No. 1', '1993-02-10', '081245678123', 'Owner'),
(2, 'Agus Setiawan', 'Jl. Merdeka No. 2', '1990-07-12', '081234567321', 'CS'),
(3, 'Siti Aminah', 'Jl. Diponegoro No. 3', '1995-01-25', '082134567890', 'CS'),
(4, 'Rina Handayani', 'Jl. Sudirman No. 4', '1989-04-18', '082145678901', 'Kasir'),
(5, 'Dewi Lestari', 'Jl. Ahmad Yani No. 5', '1994-09-09', '081355566677', 'Kasir'),
(6, 'Rudi Hartono', 'Jl. Melur No. 6', '1992-06-22', '081234567111', 'CS'),
(7, 'Lestari Widya', 'Jl. Anggrek No. 7', '1993-03-15', '081234567112', 'Kasir'),
(8, 'Teguh Prasetyo', 'Jl. Mawar No. 8', '1991-12-10', '081234567113', 'CS\r\n'),
(9, 'Nina Kartika', 'Jl. Dahlia No. 9', '1995-09-04', '081234567114', 'CS'),
(10, 'Bayu Firmansyah', 'Jl. Melati No. 10', '1990-05-29', '081234567115', 'Kasir');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `tanggal_pembayaran` date NOT NULL,
  `jumlah_pembayaran` double NOT NULL,
  `metode_pembayaran` varchar(255) NOT NULL,
  `id_transaksi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `tanggal_pembayaran`, `jumlah_pembayaran`, `metode_pembayaran`, `id_transaksi`) VALUES
(1, '2025-10-01', 180000, 'Cash', 1),
(2, '2025-10-02', 75000, 'Debit', 2),
(3, '2025-10-03', 180000, 'Transfer', 3),
(4, '2025-10-04', 150000, 'Cash', 4),
(5, '2025-10-05', 200000, 'Debit', 5),
(6, '2025-10-06', 120000, 'Transfer', 6),
(7, '2025-10-07', 250000, 'Cash', 7),
(8, '2025-10-08', 270000, 'Debit', 8),
(9, '2025-10-09', 180000, 'Cash', 9),
(10, '2025-10-10', 160000, 'Transfer', 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `harga_produk` double NOT NULL,
  `stok_produk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga_produk`, `stok_produk`) VALUES
(1, 'Shampoo Kucing', 50000, 20),
(2, 'Makanan Anjing 1kg', 80000, 15),
(3, 'Pasir Kucing 10kg', 100000, 10),
(4, 'Vitamin Hewan', 60000, 25),
(5, 'Mainan Kucing Bola', 30000, 30),
(6, 'Makanan Kucing 2kg', 120000, 12),
(7, 'Makanan Anjing Premium 2kg', 150000, 8),
(8, 'Kalung Hewan Anti Kutu', 70000, 20),
(9, 'Obat Cacing', 50000, 25),
(10, 'Sisir Bulu Hewan', 45000, 30);

-- --------------------------------------------------------

--
-- Struktur dari tabel `status_hewan`
--

CREATE TABLE `status_hewan` (
  `id_status` int(11) NOT NULL,
  `id_hewan` int(11) NOT NULL,
  `status_pelayanan` varchar(100) NOT NULL,
  `tanggal_update` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `status_hewan`
--

INSERT INTO `status_hewan` (`id_status`, `id_hewan`, `status_pelayanan`, `tanggal_update`) VALUES
(1, 1, 'Sudah Selesai', '2025-10-01'),
(2, 2, 'Sedang Diproses', '2025-10-02'),
(3, 3, 'Sudah Selesai', '2025-10-03'),
(4, 4, 'Sedang Diproses', '2025-10-04'),
(5, 5, 'Sudah Selesai', '2025-10-05'),
(6, 6, 'Menunggu Pemeriksaan', '2025-10-06'),
(7, 7, 'Sedang Diproses', '2025-10-07'),
(8, 8, 'Sudah Selesai', '2025-10-08'),
(9, 9, 'Menunggu Layanan', '2025-10-09'),
(10, 10, 'Sudah Selesai', '2025-10-10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `tanggal_transaksi` date NOT NULL,
  `jenis_transaksi` varchar(255) NOT NULL,
  `total` double NOT NULL,
  `status_pembayaran` tinyint(1) NOT NULL,
  `diskon` double NOT NULL,
  `id_customer` int(11) NOT NULL,
  `id_pegawai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `tanggal_transaksi`, `jenis_transaksi`, `total`, `status_pembayaran`, `diskon`, `id_customer`, `id_pegawai`) VALUES
(1, '2025-10-01', 'Produk', 180000, 1, 50000, 1, 1),
(2, '2025-10-02', 'Layanan', 75000, 1, 50000, 2, 2),
(3, '2025-10-03', 'Produk', 200000, 0, 50000, 3, 1),
(4, '2025-10-04', 'Layanan', 150000, 1, 50000, 4, 3),
(5, '2025-10-05', 'Produk + Layanan', 250000, 1, 50000, 5, 4),
(6, '2025-10-06', 'Produk', 120000, 1, 50000, 6, 1),
(7, '2025-10-07', 'Layanan', 250000, 1, 50000, 7, 2),
(8, '2025-10-08', 'Produk + Layanan', 300000, 0, 50000, 8, 3),
(9, '2025-10-09', 'Produk', 180000, 1, 50000, 9, 4),
(10, '2025-10-10', 'Layanan', 160000, 1, 50000, 10, 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_pegawai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `id_pegawai`) VALUES
(1, 'owner', 'owner', 1),
(2, 'cs1', 'cs1', 2),
(3, 'cs2', 'cs2', 3),
(4, 'cs3', 'cs3', 6),
(5, 'cs4', 'cs4', 9),
(9, 'kasir1', 'kasir1', 4),
(10, 'kasir2', 'kasir2', 5),
(11, 'kasir3', 'kasir3', 7),
(12, 'kasir4', 'kasir4', 10);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id_customer`);

--
-- Indeks untuk tabel `detail_transaksi_layanan`
--
ALTER TABLE `detail_transaksi_layanan`
  ADD PRIMARY KEY (`id_detail_layanan`),
  ADD KEY `detail_layanan_hewan` (`id_hewan`),
  ADD KEY `detail_layanan` (`id_layanan`),
  ADD KEY `detail_layanan_transaksi` (`id_transaksi`);

--
-- Indeks untuk tabel `detail_transaksi_produk`
--
ALTER TABLE `detail_transaksi_produk`
  ADD PRIMARY KEY (`id_detail_produk`),
  ADD KEY `detail_produk` (`id_produk`),
  ADD KEY `detail_produk_transaksi` (`id_transaksi`);

--
-- Indeks untuk tabel `hewan`
--
ALTER TABLE `hewan`
  ADD PRIMARY KEY (`id_hewan`),
  ADD KEY `hewan_customer` (`id_customer`);

--
-- Indeks untuk tabel `layanan`
--
ALTER TABLE `layanan`
  ADD PRIMARY KEY (`id_layanan`);

--
-- Indeks untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `pembayaran_transaksi` (`id_transaksi`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indeks untuk tabel `status_hewan`
--
ALTER TABLE `status_hewan`
  ADD PRIMARY KEY (`id_status`),
  ADD KEY `status_hewan_fk` (`id_hewan`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `transaksi_customer` (`id_customer`),
  ADD KEY `transaksi_pegawai` (`id_pegawai`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_pegawai` (`id_pegawai`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `customer`
--
ALTER TABLE `customer`
  MODIFY `id_customer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `detail_transaksi_layanan`
--
ALTER TABLE `detail_transaksi_layanan`
  MODIFY `id_detail_layanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `detail_transaksi_produk`
--
ALTER TABLE `detail_transaksi_produk`
  MODIFY `id_detail_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `hewan`
--
ALTER TABLE `hewan`
  MODIFY `id_hewan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `layanan`
--
ALTER TABLE `layanan`
  MODIFY `id_layanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `status_hewan`
--
ALTER TABLE `status_hewan`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_transaksi_layanan`
--
ALTER TABLE `detail_transaksi_layanan`
  ADD CONSTRAINT `detail_layanan` FOREIGN KEY (`id_layanan`) REFERENCES `layanan` (`id_layanan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_layanan_hewan` FOREIGN KEY (`id_hewan`) REFERENCES `hewan` (`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_layanan_transaksi` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `detail_transaksi_produk`
--
ALTER TABLE `detail_transaksi_produk`
  ADD CONSTRAINT `detail_produk` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_produk_transaksi` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hewan`
--
ALTER TABLE `hewan`
  ADD CONSTRAINT `hewan_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_transaksi` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `status_hewan`
--
ALTER TABLE `status_hewan`
  ADD CONSTRAINT `status_hewan_fk` FOREIGN KEY (`id_hewan`) REFERENCES `hewan` (`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaksi_pegawai` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
