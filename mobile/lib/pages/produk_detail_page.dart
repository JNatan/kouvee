import 'package:flutter/material.dart';

class ProdukDetailPage extends StatelessWidget {
  final Map produk;
  const ProdukDetailPage({super.key, required this.produk});

  @override
  Widget build(BuildContext context) {
    final imgUrl = produk["gambar_produk"] == null
        ? null
        : "http://10.31.251.212:3000/uploads/${produk["gambar_produk"]}";

    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: const Text("Detail Produk"),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // GAMBAR
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: imgUrl == null
                  ? const Center(child: Text("Tidak ada gambar"))
                  : ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(imgUrl, fit: BoxFit.contain),
                    ),
            ),

            const SizedBox(height: 20),

            // NAMA
            Text(
              produk["nama_produk"],
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 10),

            // HARGA
            Text(
              "Rp ${produk["harga_produk"]}",
              style: const TextStyle(
                fontSize: 20,
                color: Colors.blue,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 5),

            // STOK
            Text(
              "Stok tersedia: ${produk["stok_produk"]}",
              style: const TextStyle(fontSize: 16),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
