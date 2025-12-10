import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'layanan_detail_page.dart';

class LayananPage extends StatefulWidget {
  const LayananPage({super.key});

  @override
  State<LayananPage> createState() => _LayananPageState();
}

class _LayananPageState extends State<LayananPage> {
  List layanan = [];
  String search = "";
  String sort = "";

  @override
  void initState() {
    super.initState();
    load();
  }

  void load() async {
    final data = await ApiService.getLayanan(search: search, sort: sort);
    setState(() => layanan = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        title: const Text("Layanan Kouvee"),
        backgroundColor: Colors.blue,
      ),

      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          children: [
            // TITLE
            const Text(
              "Layanan Kouvee Petshop",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 15),

            // SEARCH + SORT
            Row(
              children: [
                // Search
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Cari layanan...",
                      filled: true,
                      fillColor: Colors.white,
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    onChanged: (v) {
                      search = v;
                      load();
                    },
                  ),
                ),

                const SizedBox(width: 10),

                // Sort
                DropdownButton(
                  value: sort == "" ? null : sort,
                  hint: const Text("Sort"),
                  items: const [
                    DropdownMenuItem(value: "nama", child: Text("A-Z")),
                    DropdownMenuItem(
                      value: "harga_asc",
                      child: Text("Termurah"),
                    ),
                    DropdownMenuItem(
                      value: "harga_desc",
                      child: Text("Termahal"),
                    ),
                  ],
                  onChanged: (val) {
                    sort = val!;
                    load();
                  },
                ),
              ],
            ),

            const SizedBox(height: 15),

            // GRID LAYANAN
            Expanded(
              child: GridView.builder(
                itemCount: layanan.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 20,
                  crossAxisSpacing: 20,
                  childAspectRatio: 0.80,
                ),
                itemBuilder: (context, i) {
                  final l = layanan[i];

                  return InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => LayananDetailPage(layanan: l),
                        ),
                      );
                    },

                    child: Container(
                      padding: const EdgeInsets.all(15),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black12,
                            blurRadius: 6,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),

                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // NAMA
                          Text(
                            l["nama_layanan"],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),

                          const SizedBox(height: 10),

                          // DESKRIPSI (dipotong)
                          Expanded(
                            child: Text(
                              l["deskripsi_layanan"] ?? "",
                              maxLines: 4,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                color: Colors.black87,
                              ),
                            ),
                          ),

                          const SizedBox(height: 10),

                          // HARGA
                          Text(
                            "Rp ${l["harga_layanan"].toString()}",
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
