import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'auth_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final ScrollController _scrollController1 = ScrollController();
  final ScrollController _scrollController2 = ScrollController();
  Timer? _scrollTimer;
  List<dynamic> volunteers = [];

  final List<dynamic> fallbackVolunteers = [
    {'name': 'राहुल शर्मा', 'role': 'Kanpur', 'avatar': 'assets/images/volunteer_avatar.png'},
    {'name': 'प्रिया सिंह', 'role': 'Lucknow', 'avatar': 'assets/images/volunteer_avatar.png'},
    {'name': 'अमित यादव', 'role': 'Varanasi', 'avatar': 'assets/images/volunteer_avatar.png'},
    {'name': 'सुनीता वर्मा', 'role': 'Agra', 'avatar': 'assets/images/volunteer_avatar.png'},
    {'name': 'विक्रम सिंह', 'role': 'Meerut', 'avatar': 'assets/images/volunteer_avatar.png'},
    {'name': 'नेहा गुप्ता', 'role': 'Ghaziabad', 'avatar': 'assets/images/volunteer_avatar.png'},
  ];

  @override
  void initState() {
    super.initState();
    _loadVolunteers();
    _startAutoScroll();
  }

  Future<void> _loadVolunteers() async {
    try {
      final jsonString = await rootBundle.loadString('assets/data/verified_users.json');
      final data = jsonDecode(jsonString);
      final List<dynamic> list = data is List ? data : [];
      
      final verified = list.map((user) {
        return {
          'name': user['Column2'] ?? user['आपका पूरा नाम क्या है? '] ?? 'Unknown',
          'role': user['Column4'] ?? user['जिला '] ?? 'Volunteer',
          'avatar': 'assets/images/volunteer_avatar.png',
        };
      }).toList();

      setState(() {
        volunteers = verified.isNotEmpty ? verified : fallbackVolunteers;
      });
    } catch (e) {
      setState(() {
        volunteers = fallbackVolunteers;
      });
    }
  }

  void _startAutoScroll() {
    _scrollTimer = Timer.periodic(const Duration(milliseconds: 30), (timer) {
      if (_scrollController1.hasClients) {
        double maxScroll = _scrollController1.position.maxScrollExtent;
        double current = _scrollController1.offset;
        double target = current + 1.0;
        if (target >= maxScroll) {
          _scrollController1.jumpTo(0.0);
        } else {
          _scrollController1.jumpTo(target);
        }
      }
      if (_scrollController2.hasClients) {
        double maxScroll = _scrollController2.position.maxScrollExtent;
        double current = _scrollController2.offset;
        double target = current + 1.2;
        if (target >= maxScroll) {
          _scrollController2.jumpTo(0.0);
        } else {
          _scrollController2.jumpTo(target);
        }
      }
    });
  }

  @override
  void dispose() {
    _scrollTimer?.cancel();
    _scrollController1.dispose();
    _scrollController2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      body: Stack(
        children: [
          // Background sliders
          Positioned.fill(
            child: Column(
              children: [
                SizedBox(
                  height: screenHeight * 0.3,
                  child: _buildScrollRow(_scrollController1, true),
                ),
                SizedBox(
                  height: screenHeight * 0.3,
                  child: _buildScrollRow(_scrollController2, false),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          const Color(0xFF1A1A1A).withOpacity(0.85),
                          const Color(0xFF1A1A1A),
                        ],
                        stops: const [0.0, 0.4, 1.0],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Foreground Content
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Hero(
                  tag: 'logo',
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFE30512).withOpacity(0.3),
                          blurRadius: 20,
                          spreadRadius: 5,
                        )
                      ],
                    ),
                    child: Image.asset(
                      'assets/images/stf_logo.jpg',
                      width: 80,
                      height: 80,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Samajwadi Tech Force',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Digital Revolution Begins With You',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[400],
                  ),
                ),
                const SizedBox(height: 48),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const AuthScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE30512),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 5,
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Get Started',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                Text(
                  '© 2026 Samajwadi Party',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildScrollRow(ScrollController controller, bool leftToRight) {
    if (volunteers.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    final double itemWidth = 140;

    return ListView.builder(
      controller: controller,
      scrollDirection: Axis.horizontal,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        final item = volunteers[index % volunteers.length];
        return Container(
          width: itemWidth,
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.15)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 30,
                backgroundImage: AssetImage(item['avatar']),
                backgroundColor: Colors.grey[800],
              ),
              const SizedBox(height: 12),
              Text(
                item['name'],
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                item['role'],
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Color(0xFF009933),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
