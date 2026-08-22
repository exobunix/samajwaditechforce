import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  Map<String, dynamic>? userInfo;
  List<dynamic> recentVolunteers = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final user = await ApiService.getSavedUser();
    
    // Load volunteers
    List<dynamic> volunteersList = [];
    try {
      final jsonString = await rootBundle.loadString('assets/data/verified_users.json');
      final data = jsonDecode(jsonString);
      if (data is List) {
        volunteersList = data.take(10).map((user) {
          return {
            'name': user['Column2'] ?? user['आपका पूरा नाम क्या है? '] ?? 'Unknown',
            'role': user['Column4'] ?? user['जिला '] ?? 'Volunteer',
          };
        }).toList();
      }
    } catch (e) {
      volunteersList = [
        {'name': 'राहुल शर्मा', 'role': 'Kanpur'},
        {'name': 'प्रिया सिंह', 'role': 'Lucknow'},
        {'name': 'अमित यादव', 'role': 'Varanasi'},
      ];
    }

    setState(() {
      userInfo = user;
      recentVolunteers = volunteersList;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = userInfo?['user'] ?? {};
    final String name = user['name'] ?? 'Volunteer';
    final String district = user['district'] ?? 'Uttar Pradesh';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFE30512),
        title: Row(
          children: [
            Image.asset('assets/images/stf_logo.jpg', width: 40, height: 40),
            const SizedBox(width: 12),
            const Text(
              'STF Dashboard',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('No new notifications')),
              );
            },
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome Header Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(
                      color: Color(0xFFE30512),
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(24),
                        bottomRight: Radius.circular(24),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'जय समाजवाद, $name!',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'District: $district | Status: Active Volunteer',
                          style: const TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                      ],
                    ),
                  ),

                  // Campaign Banner
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.asset(
                        'assets/images/heropre.png',
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: 180,
                        errorBuilder: (c, o, s) => Container(
                          height: 180,
                          color: Colors.grey[300],
                          child: const Icon(Icons.campaign, size: 80, color: Colors.grey),
                        ),
                      ),
                    ),
                  ),

                  // Stats Grid
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            title: 'Active Volunteers',
                            value: '12,450+',
                            color: const Color(0xFF009933),
                            icon: Icons.people,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildStatCard(
                            title: 'Tasks Finished',
                            value: '87%',
                            color: const Color(0xFFE30512),
                            icon: Icons.check_circle,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Quick Action Links
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Daily Tasks & Missions',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 2,
                      child: ListTile(
                        leading: const CircleAvatar(
                          backgroundColor: Color(0xFFE30512),
                          child: Icon(Icons.task, color: Colors.white),
                        ),
                        title: const Text('Share SP Achievements on WhatsApp'),
                        subtitle: const Text('Daily Mission - Share the latest banner with 5 groups'),
                        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Opening campaign sharing link...')),
                          );
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Active / Verified volunteers
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Verified Tech Force Members',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: recentVolunteers.length,
                    itemBuilder: (context, index) {
                      final vol = recentVolunteers[index];
                      return ListTile(
                        leading: const CircleAvatar(
                          backgroundImage: AssetImage('assets/images/volunteer_avatar.png'),
                        ),
                        title: Text(vol['name']),
                        subtitle: Text(vol['role']),
                        trailing: const Wrap(
                          spacing: 4,
                          children: [
                            Icon(Icons.verified, color: Colors.blue, size: 18),
                            Text('Verified', style: TextStyle(color: Colors.blue, fontSize: 12)),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required Color color,
    required IconData icon,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(fontSize: 14, color: Colors.black54),
            ),
          ],
        ),
      ),
    );
  }
}
