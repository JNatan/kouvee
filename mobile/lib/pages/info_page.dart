import 'package:flutter/material.dart';
import 'landing_page.dart';

class InfoPage extends StatelessWidget {
  const InfoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xfff7f7f7),

      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 30),
              width: double.infinity,
              color: const Color(0xff2b7cff),
              child: Column(
                children: const [
                  Text(
                    "Profil & Informasi Petshop",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "Petshop terpercaya dengan pelayanan terbaik",
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),

            // CONTENT
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  section(
                    title: "Tentang Kami",
                    content:
                        "Kouvee Pet Shop berdiri sejak 2020, menyediakan layanan grooming, konsultasi kesehatan, dan kebutuhan hewan.",
                  ),

                  section(
                    title: "Visi & Misi",
                    contentWidget: Column(
                      children: [
                        infoCard(
                          "Visi",
                          "Menjadi pet shop terbaik dengan standar pelayanan profesional.",
                        ),
                        const SizedBox(height: 15),
                        infoCard(
                          "Misi",
                          "- Memberikan layanan grooming terbaik\n"
                              "- Edukasi pemilik hewan\n"
                              "- Menjual produk berkualitas\n"
                              "- Mengutamakan kenyamanan hewan",
                        ),
                      ],
                    ),
                  ),

                  section(
                    title: "Jam Operasional",
                    contentWidget: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text("Senin - Jumat: 09.00 - 20.00"),
                        Text("Sabtu: 09.00 - 18.00"),
                        Text("Minggu: Tutup"),
                      ],
                    ),
                  ),

                  section(
                    title: "Kontak & Lokasi",
                    content:
                        "Alamat: Jl. Malioboro No. 22, Yogyakarta\nTelepon: 081234567890\nEmail: info@kouvee.com\nInstagram: @kouvee.petshop",
                  ),

                  const SizedBox(height: 30),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff2b7cff),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 40,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const LandingPage()),
                      );
                    },
                    child: const Text(
                      "Get Started",
                      style: TextStyle(fontSize: 16),
                    ),
                  ),

                  const SizedBox(height: 30),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget section({
    required String title,
    String? content,
    Widget? contentWidget,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xff2b7cff),
            ),
          ),
          const SizedBox(height: 10),
          if (content != null) Text(content),
          if (contentWidget != null) contentWidget,
        ],
      ),
    );
  }

  Widget infoCard(String title, String content) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xffeef4ff),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Text(content),
        ],
      ),
    );
  }
}
