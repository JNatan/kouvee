import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'hewan_form_page.dart';
import 'hewan_detail_page.dart';

class HewanListPage extends StatefulWidget {
  const HewanListPage({super.key});

  @override
  State<HewanListPage> createState() => _HewanListPageState();
}

class _HewanListPageState extends State<HewanListPage> {
  List hewan = [];
  String search = "";

  @override
  void initState() {
    super.initState();
    loadData();
  }

  void loadData() async {
    hewan = await ApiService.getHewan(search: search);
    setState(() {});
  }

  void deleteHewan(String id) async {
    await ApiService.deleteHewan(id);
    loadData();
  }

  void confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text("Hapus Hewan"),
        content: Text("Yakin ingin menghapus hewan ini?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("Batal"),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await ApiService.deleteHewan(id);
              loadData();
            },
            child: Text("Hapus", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Data Hewan"), backgroundColor: Colors.blue),

      // floatingActionButton: FloatingActionButton(
      //   child: Icon(Icons.add),
      //   onPressed: () {
      //     Navigator.push(
      //       context,
      //       MaterialPageRoute(builder: (_) => HewanFormPage()),
      //     ).then((_) => loadData());
      //   },
      // ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(10),
        child: ElevatedButton.icon(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => HewanFormPage()),
            ).then((_) => loadData());
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue,
            padding: EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          icon: Icon(Icons.add, color: Colors.white),
          label: Text(
            "Tambah Hewan",
            style: TextStyle(color: Colors.white, fontSize: 17),
          ),
        ),
      ),

      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(10),
            child: TextField(
              decoration: InputDecoration(
                hintText: "Cari hewan...",
                border: OutlineInputBorder(),
              ),
              onChanged: (v) {
                search = v;
                loadData();
              },
            ),
          ),

          Expanded(
            child: hewan.isEmpty
                ? Center(child: Text("Tidak ada data"))
                : ListView.builder(
                    itemCount: hewan.length,
                    itemBuilder: (context, i) {
                      final h = hewan[i];
                      return Card(
                        child: ListTile(
                          title: Text(h["nama_hewan"]),
                          subtitle: Text(
                            "${h["jenis_hewan"]} • Pemilik: ${h["nama_customer"]}",
                          ),

                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => HewanDetailPage(hewan: h),
                              ),
                            );
                          },

                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(Icons.edit, color: Colors.orange),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => HewanFormPage(hewan: h),
                                    ),
                                  ).then((_) => loadData());
                                },
                              ),
                              IconButton(
                                icon: Icon(Icons.delete, color: Colors.red),
                                onPressed: () =>
                                    confirmDelete(h["id_hewan"].toString()),
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
    );
  }
}
