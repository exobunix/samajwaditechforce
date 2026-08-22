import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../services/api_service.dart';

class IdCardTab extends StatefulWidget {
  const IdCardTab({super.key});

  @override
  State<IdCardTab> createState() => _IdCardTabState();
}

class _IdCardTabState extends State<IdCardTab> {
  Map<String, dynamic>? userInfo;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await ApiService.getSavedUser();
    setState(() {
      userInfo = user;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = userInfo?['user'] ?? {};
    final String name = user['name'] ?? 'Volunteer Name';
    final String email = user['email'] ?? 'volunteer@email.com';
    final String phone = user['phone'] ?? '9876543210';
    final String district = user['district'] ?? 'Lucknow';
    final String role = user['role'] ?? 'Digital Warrior';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF009933),
        title: const Text(
          'कार्यकर्ता पहचान पत्र (Volunteer ID Card)',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  const SizedBox(height: 20),

                  // ID Card Widget
                  Center(
                    child: Card(
                      elevation: 8,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Container(
                        width: 300,
                        height: 480,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Colors.white,
                          border: Border.all(color: const Color(0xFFE30512), width: 3),
                        ),
                        child: Column(
                          children: [
                            // Card Header (Red Header with SP banner)
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: const BoxDecoration(
                                color: Color(0xFFE30512),
                                borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(12),
                                  topRight: Radius.circular(12),
                                ),
                              ),
                              child: const Column(
                                children: [
                                  Text(
                                    'SAMAJWADI PARTY',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      letterSpacing: 1.2,
                                    ),
                                  ),
                                  Text(
                                    'TECH FORCE VOLUNTEER',
                                    style: TextStyle(
                                      color: Color(0xFFFFEB3B),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 16),

                            // User Avatar
                            Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(
                                color: Color(0xFF009933),
                                shape: BoxShape.circle,
                              ),
                              child: const CircleAvatar(
                                radius: 55,
                                backgroundImage: AssetImage('assets/images/volunteer_avatar.png'),
                                backgroundColor: Colors.white,
                              ),
                            ),

                            const SizedBox(height: 16),

                            // User Info Fields
                            Text(
                              name.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1A1A1A),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              role,
                              style: const TextStyle(
                                fontSize: 13,
                                color: Color(0xFF009933),
                                fontWeight: FontWeight.bold,
                              ),
                            ),

                            const Divider(indent: 30, endIndent: 30, height: 24),

                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 20.0),
                              child: Column(
                                children: [
                                  _buildCardRow('ID CODE:', 'STF-2026-5890'),
                                  _buildCardRow('DISTRICT:', district),
                                  _buildCardRow('PHONE:', phone),
                                  _buildCardRow('EMAIL:', email),
                                ],
                              ),
                            ),

                            const Spacer(),

                            // Verification Stamp / Barcode
                            Container(
                              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                              color: const Color(0xFF009933).withOpacity(0.1),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.verified, color: Color(0xFF009933), size: 20),
                                  SizedBox(width: 6),
                                  Text(
                                    'VERIFIED STF MEMBER',
                                    style: TextStyle(
                                      color: Color(0xFF009933),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            
                            // Mock Barcode
                            Container(
                              height: 36,
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(12),
                                  bottomRight: Radius.circular(12),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: List.generate(
                                  18,
                                  (index) => Container(
                                    width: (index % 3 == 0) ? 3.0 : 1.0,
                                    margin: const EdgeInsets.symmetric(horizontal: 1.5),
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Actions
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('ID Card saved to device! 💾')),
                            );
                          },
                          icon: const Icon(Icons.download, color: Color(0xFF009933)),
                          label: const Text('Download ID', style: TextStyle(color: Color(0xFF009933))),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            side: const BorderSide(color: Color(0xFF009933)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Share.share('Check out my Samajwadi Tech Force ID Card! Join STF today.');
                          },
                          icon: const Icon(Icons.share),
                          label: const Text('Share ID Card'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFE30512),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildCardRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87),
          ),
        ],
      ),
    );
  }
}
