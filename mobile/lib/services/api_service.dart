import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://10.31.251.212:3000/api";

  // LOGIN -------------------------
  static Future<Map<String, dynamic>> login(
    String username,
    String password,
  ) async {
    final url = Uri.parse("$baseUrl/auth/login");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"username": username, "password": password}),
    );

    return jsonDecode(response.body);
  }

  // GET PRODUK PUBLIC -------------
  static Future<List<dynamic>> getProduk({
    String search = "",
    String sort = "",
  }) async {
    final url = Uri.parse("$baseUrl/produk?search=$search&sort=$sort");
    final response = await http.get(url);
    return jsonDecode(response.body);
  }

  // GET LAYANAN PUBLIC -----------
  static Future<List<dynamic>> getLayanan({
    String search = "",
    String sort = "",
  }) async {
    final url = Uri.parse("$baseUrl/layanan?search=$search&sort=$sort");
    final response = await http.get(url);
    return jsonDecode(response.body);
  }

  // CUSTOMER --------------------------
  static Future<List<dynamic>> getCustomer({String search = ""}) async {
    final url = Uri.parse("$baseUrl/customer?search=$search");
    final res = await http.get(url);

    final json = jsonDecode(res.body);
    return json["data"] ?? [];
  }

  static Future<bool> createCustomer(Map data) async {
    final url = Uri.parse("$baseUrl/customer");
    final res = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
    return jsonDecode(res.body)["success"];
  }

  static Future<bool> updateCustomer(String id, Map data) async {
    final url = Uri.parse("$baseUrl/customer/$id");
    final res = await http.put(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
    return jsonDecode(res.body)["success"];
  }

  static Future<bool> deleteCustomer(String id) async {
    final url = Uri.parse("$baseUrl/customer/$id");
    final res = await http.delete(url);
    return jsonDecode(res.body)["success"];
  }

  // HEWAN ------------------------------
  static Future<List<dynamic>> getHewan({String search = ""}) async {
    final url = Uri.parse("$baseUrl/hewan?search=$search");
    final res = await http.get(url);

    final json = jsonDecode(res.body);
    return json["data"] ?? [];
  }

  static Future<bool> createHewan(Map data) async {
    final url = Uri.parse("$baseUrl/hewan");
    final res = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
    return jsonDecode(res.body)["success"];
  }

  static Future<bool> updateHewan(String id, Map data) async {
    final url = Uri.parse("$baseUrl/hewan/$id");
    final res = await http.put(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
    return jsonDecode(res.body)["success"];
  }

  static Future<bool> deleteHewan(String id) async {
    final url = Uri.parse("$baseUrl/hewan/$id");
    final res = await http.delete(url);
    return jsonDecode(res.body)["success"];
  }
}
