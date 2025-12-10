import 'package:flutter/material.dart';
import 'pages/landing_page.dart';

void main() {
  runApp(const KouveeApp());
}

class KouveeApp extends StatelessWidget {
  const KouveeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Kouvee Mobile",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),

      // Pertama kali aplikasi dibuka: tampilkan landing public
      home: LandingPage(),
    );
  }
}
