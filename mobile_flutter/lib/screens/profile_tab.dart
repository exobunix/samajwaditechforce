import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'auth_screen.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  Map<String, dynamic>? userInfo;
  bool isLoading = true;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _districtController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await ApiService.getSavedUser();
    setState(() {
      userInfo = user;
      _nameController.text = user?['user']?['name'] ?? '';
      _phoneController.text = user?['user']?['phone'] ?? '';
      _districtController.text = user?['user']?['district'] ?? '';
      isLoading = false;
    });
  }

  Future<void> _saveProfile() async {
    // Save updated local details (mock backend update)
    if (userInfo != null) {
      setState(() {
        userInfo!['user']['name'] = _nameController.text;
        userInfo!['user']['phone'] = _phoneController.text;
        userInfo!['user']['district'] = _districtController.text;
      });
      // In a real app we'd trigger ApiService.updateProfile, for now write to SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userInfo', jsonEncode(userInfo!));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!')),
        );
      }
    }
  }

  Future<void> _logout() async {
    await ApiService.logout();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const AuthScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = userInfo?['user'] ?? {};
    final String role = user['role'] ?? 'Volunteer';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFE30512),
        title: const Text(
          'मेरी प्रोफ़ाइल (Profile)',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  
                  // Profile Header Circle
                  const Center(
                    child: CircleAvatar(
                      radius: 50,
                      backgroundImage: AssetImage('assets/images/volunteer_avatar.png'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _nameController.text.toUpperCase(),
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    role,
                    style: const TextStyle(fontSize: 14, color: Color(0xFF009933), fontWeight: FontWeight.bold),
                  ),
                  
                  const SizedBox(height: 32),

                  // Edit Form fields
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Name (नाम)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person, color: Color(0xFFE30512)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone (फ़ोन)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.phone, color: Color(0xFFE30512)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _districtController,
                    decoration: const InputDecoration(
                      labelText: 'District (जिला)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.location_on, color: Color(0xFFE30512)),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Save Profile Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _saveProfile,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF009933),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Save Profile Details', style: TextStyle(fontSize: 16)),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Logout button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton.icon(
                      onPressed: _logout,
                      icon: const Icon(Icons.logout, color: Color(0xFFE30512)),
                      label: const Text('Log Out', style: TextStyle(color: Color(0xFFE30512))),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFE30512)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}


