import 'package:flutter/material.dart';

class LayananDetailPage extends StatelessWidget {
  final Map layanan;
  const LayananDetailPage({super.key, required this.layanan});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        title: const Text("Detail Layanan"),
        backgroundColor: Colors.blue,
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // NAMA
            Text(
              layanan["nama_layanan"],
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 20),

            // DESKRIPSI
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                layanan["deskripsi_layanan"],
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.justify,
              ),
            ),

            const SizedBox(height: 20),

            // HARGA
            Text(
              "Harga: Rp ${layanan["harga_layanan"]}",
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
