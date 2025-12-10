import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class HewanFormPage extends StatefulWidget {
  final Map? hewan;
  const HewanFormPage({super.key, this.hewan});

  @override
  State<HewanFormPage> createState() => _HewanFormPageState();
}

class _HewanFormPageState extends State<HewanFormPage> {
  final nameC = TextEditingController();
  final jenisC = TextEditingController();
  DateTime? birthDate;
  String? selectedCustomer;

  List customers = [];

  @override
  void initState() {
    super.initState();
    loadCustomers();

    if (widget.hewan != null) {
      nameC.text = widget.hewan!["nama_hewan"];
      jenisC.text = widget.hewan!["jenis_hewan"];
      selectedCustomer = widget.hewan!["id_customer"].toString();

      if (widget.hewan!["tanggal_lahir_hewan"] != null) {
        birthDate = DateTime.parse(widget.hewan!["tanggal_lahir_hewan"]);
      }
    }
  }

  void loadCustomers() async {
    customers = await ApiService.getCustomer();
    setState(() {});
  }

  void pickDate() async {
    final d = await showDatePicker(
      context: context,
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      initialDate: birthDate ?? DateTime(2015),
    );
    if (d != null) setState(() => birthDate = d);
  }

  void save() async {
    if (nameC.text.isEmpty || jenisC.text.isEmpty || selectedCustomer == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Semua field wajib diisi")));
      return;
    }

    final data = {
      "nama_hewan": nameC.text,
      "jenis_hewan": jenisC.text,
      "tanggal_lahir_hewan": birthDate != null
          ? birthDate!.toIso8601String().split("T")[0]
          : null,
      "id_customer": selectedCustomer,
    };

    bool success;

    if (widget.hewan == null) {
      success = await ApiService.createHewan(data);
    } else {
      success = await ApiService.updateHewan(
        widget.hewan!["id_hewan"].toString(),
        data,
      );
    }

    if (success) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.hewan != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit ? "Edit Hewan" : "Tambah Hewan"),
        backgroundColor: Colors.blue,
      ),

      body: customers.isEmpty
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(20),
              child: Column(
                children: [
                  // Nama Hewan
                  TextField(
                    controller: nameC,
                    decoration: InputDecoration(
                      labelText: "Nama Hewan",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 15),

                  // Jenis Hewan
                  TextField(
                    controller: jenisC,
                    decoration: InputDecoration(
                      labelText: "Jenis Hewan (Dog, Cat, dll)",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 15),

                  // Tanggal Lahir
                  GestureDetector(
                    onTap: pickDate,
                    child: Container(
                      padding: EdgeInsets.symmetric(
                        vertical: 15,
                        horizontal: 12,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            birthDate == null
                                ? "Pilih Tanggal Lahir"
                                : "${birthDate!.day}-${birthDate!.month}-${birthDate!.year}",
                            style: TextStyle(fontSize: 16),
                          ),
                          Icon(Icons.calendar_month),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 15),

                  // Dropdown Customer
                  DropdownButtonFormField(
                    decoration: InputDecoration(
                      labelText: "Pilih Customer (Pemilik)",
                      border: OutlineInputBorder(),
                    ),
                    initialValue: selectedCustomer,
                    items: customers.map((c) {
                      return DropdownMenuItem(
                        value: c["id_customer"].toString(),
                        child: Text(c["nama_customer"]),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedCustomer = v),
                  ),

                  SizedBox(height: 30),

                  // Tombol Simpan
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: save,
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: Colors.blue,
                      ),
                      child: Text("Simpan"),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
