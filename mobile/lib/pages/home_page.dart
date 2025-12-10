import 'package:flutter/material.dart';
import 'customer/customer_list_page.dart';
import 'hewan/hewan_list_page.dart';
import 'landing_page.dart';

class HomePage extends StatelessWidget {
  final Map user;
  const HomePage({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    bool isCS = user["jabatan"] == "CS";

    return Scaffold(
      backgroundColor: Colors.blue[50],

      appBar: AppBar(
        title: Text("Dashboard - ${user["nama_pegawai"]}"),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              showDialog(
                context: context,
                builder: (_) => AlertDialog(
                  title: const Text("Logout"),
                  content: const Text("Yakin ingin logout?"),
                  actions: [
                    TextButton(
                      child: const Text("Batal"),
                      onPressed: () => Navigator.pop(context),
                    ),
                    TextButton(
                      child: const Text(
                        "Logout",
                        style: TextStyle(color: Colors.red),
                      ),
                      onPressed: () {
                        Navigator.pop(context);

                        // kembali ke landing page
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const LandingPage(),
                          ),
                          (route) => false,
                        );
                      },
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Selamat datang, ${user["nama_pegawai"]}",
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 25),

            if (isCS)
              Expanded(
                child: GridView(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 20,
                    crossAxisSpacing: 20,
                    childAspectRatio: 1,
                  ),
                  children: [
                    _menuCard(
                      context,
                      title: "Data Customer",
                      icon: Icons.person_outline,
                      color: Colors.blue,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => CustomerListPage()),
                        );
                      },
                    ),

                    _menuCard(
                      context,
                      title: "Data Hewan",
                      icon: Icons.pets,
                      color: Colors.orange,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => HewanListPage()),
                        );
                      },
                    ),
                  ],
                ),
              ),

            if (!isCS)
              const Center(
                child: Text(
                  "Akses terbatas. Anda bukan CS.",
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _menuCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required Function onTap,
  }) {
    return InkWell(
      onTap: () => onTap(),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 6,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Icon(icon, size: 40, color: color),
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}
