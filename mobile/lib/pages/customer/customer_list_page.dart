import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'customer_form_page.dart';
import 'customer_detail_page.dart';

class CustomerListPage extends StatefulWidget {
  const CustomerListPage({super.key});

  @override
  State<CustomerListPage> createState() => _CustomerListPageState();
}

class _CustomerListPageState extends State<CustomerListPage> {
  List customers = [];
  String search = "";

  @override
  void initState() {
    super.initState();
    loadData();
  }

  void loadData() async {
    customers = await ApiService.getCustomer(search: search);
    setState(() {});
  }

  void confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text("Hapus Customer"),
        content: Text("Yakin ingin menghapus data ini?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("Batal"),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await ApiService.deleteCustomer(id);
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
      appBar: AppBar(
        title: Text("Data Customer"),
        backgroundColor: Colors.blue,
      ),

      // floatingActionButton: FloatingActionButton(
      //   onPressed: () {
      //     Navigator.push(
      //       context,
      //       MaterialPageRoute(builder: (_) => CustomerFormPage()),
      //     ).then((_) => loadData());
      //   },
      //   child: Icon(Icons.add),
      // ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(10),
        child: ElevatedButton.icon(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => CustomerFormPage()),
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
            "Tambah Customer",
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
                hintText: "Cari customer...",
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                search = value;
                loadData();
              },
            ),
          ),

          Expanded(
            child: customers.isEmpty
                ? Center(child: Text("Tidak ada data"))
                : ListView.builder(
                    itemCount: customers.length,
                    itemBuilder: (context, i) {
                      final c = customers[i];
                      return Card(
                        child: ListTile(
                          title: Text(c["nama_customer"]),
                          subtitle: Text(c["no_telp_customer"] ?? "-"),

                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CustomerDetailPage(customer: c),
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
                                      builder: (_) =>
                                          CustomerFormPage(customer: c),
                                    ),
                                  ).then((_) => loadData());
                                },
                              ),
                              IconButton(
                                icon: Icon(Icons.delete, color: Colors.red),
                                onPressed: () =>
                                    confirmDelete(c["id_customer"].toString()),
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
