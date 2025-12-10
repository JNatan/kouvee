import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'produk_detail_page.dart';

class ProdukPage extends StatefulWidget {
  const ProdukPage({super.key});

  @override
  State<ProdukPage> createState() => _ProdukPageState();
}

class _ProdukPageState extends State<ProdukPage> {
  List produk = [];
  String search = "";
  String sort = "";

  @override
  void initState() {
    super.initState();
    loadData();
  }

  void loadData() async {
    final data = await ApiService.getProduk(search: search, sort: sort);
    setState(() => produk = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        title: const Text("Daftar Produk"),
        backgroundColor: Colors.blue,
      ),

      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          children: [
            // JUDUL
            const Text(
              "Daftar Produk Kouvee",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 15),

            // Search & Sort
            Row(
              children: [
                // SEARCH
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Cari produk...",
                      filled: true,
                      fillColor: Colors.white,
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    onChanged: (v) {
                      search = v;
                      loadData();
                    },
                  ),
                ),

                const SizedBox(width: 10),

                // SORT
                DropdownButton(
                  hint: const Text("Sort"),
                  value: sort == "" ? null : sort,
                  items: const [
                    DropdownMenuItem(
                      value: "harga_asc",
                      child: Text("Termurah"),
                    ),
                    DropdownMenuItem(
                      value: "harga_desc",
                      child: Text("Termahal"),
                    ),
                    DropdownMenuItem(
                      value: "stok_desc",
                      child: Text("Stok Banyak"),
                    ),
                    DropdownMenuItem(
                      value: "stok_asc",
                      child: Text("Stok Sedikit"),
                    ),
                  ],
                  onChanged: (val) {
                    sort = val!;
                    loadData();
                  },
                ),
              ],
            ),

            const SizedBox(height: 15),

            // GRID PRODUK
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 15,
                  mainAxisSpacing: 15,
                  childAspectRatio: 0.72,
                ),
                itemCount: produk.length,
                itemBuilder: (context, i) {
                  final p = produk[i];
                  final imgUrl = p["gambar_produk"] == null
                      ? null
                      : "http://10.31.251.212:3000/uploads/${p["gambar_produk"]}";

                  return InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProdukDetailPage(produk: p),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
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
                          // GAMBAR
                          Expanded(
                            child: imgUrl == null
                                ? Container(
                                    alignment: Alignment.center,
                                    color: Colors.grey[300],
                                    child: const Text("Tidak ada gambar"),
                                  )
                                : Image.network(imgUrl, fit: BoxFit.contain),
                          ),

                          const SizedBox(height: 10),

                          // NAMA
                          Text(
                            p["nama_produk"],
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 15,
                            ),
                          ),

                          const SizedBox(height: 6),

                          // HARGA
                          Text(
                            "Rp ${p["harga_produk"].toString()}",
                            style: const TextStyle(
                              color: Colors.blue,
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          // STOK
                          Text(
                            "Stok: ${p["stok_produk"]}",
                            style: const TextStyle(fontSize: 14),
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
