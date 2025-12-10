import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class CustomerFormPage extends StatefulWidget {
  final Map? customer;
  const CustomerFormPage({super.key, this.customer});

  @override
  State<CustomerFormPage> createState() => _CustomerFormPageState();
}

class _CustomerFormPageState extends State<CustomerFormPage> {
  final nameC = TextEditingController();
  final addressC = TextEditingController();
  final phoneC = TextEditingController();
  DateTime? birthDate;

  @override
  void initState() {
    super.initState();

    if (widget.customer != null) {
      final c = widget.customer!;
      nameC.text = c["nama_customer"];
      addressC.text = c["alamat_customer"] ?? "";
      phoneC.text = c["no_telp_customer"] ?? "";
      if (c["tanggal_lahir_customer"] != null) {
        birthDate = DateTime.parse(c["tanggal_lahir_customer"]);
      }
    }
  }

  void pickDate() async {
    final d = await showDatePicker(
      context: context,
      initialDate: birthDate ?? DateTime(2000),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (d != null) setState(() => birthDate = d);
  }

  void save() async {
    final data = {
      "nama_customer": nameC.text,
      "alamat_customer": addressC.text,
      "no_telp_customer": phoneC.text,
      "tanggal_lahir_customer": birthDate == null
          ? null
          : birthDate!.toIso8601String().split("T")[0],
    };

    bool success;

    if (widget.customer == null) {
      success = await ApiService.createCustomer(data);
    } else {
      success = await ApiService.updateCustomer(
        widget.customer!["id_customer"].toString(),
        data,
      );
    }

    if (success) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.customer != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit ? "Edit Customer" : "Tambah Customer"),
        backgroundColor: Colors.blue,
      ),

      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: nameC,
              decoration: InputDecoration(
                labelText: "Nama Customer",
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 15),

            TextField(
              controller: addressC,
              decoration: InputDecoration(
                labelText: "Alamat",
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            SizedBox(height: 15),

            TextField(
              controller: phoneC,
              decoration: InputDecoration(
                labelText: "No Telepon",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.phone,
            ),
            SizedBox(height: 15),

            GestureDetector(
              onTap: pickDate,
              child: Container(
                padding: EdgeInsets.symmetric(vertical: 15, horizontal: 12),
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
                    ),
                    Icon(Icons.calendar_month),
                  ],
                ),
              ),
            ),

            SizedBox(height: 25),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: save,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 14),
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
