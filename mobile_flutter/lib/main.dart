import 'package:flutter/material.dart';
import 'screens/onboarding_screen.dart';
import 'screens/main_navigation.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Check if user is already logged in
  final userInfo = await ApiService.getSavedUser();
  final bool isLoggedIn = userInfo != null;

  runApp(MyApp(isLoggedIn: isLoggedIn));
}

class MyApp extends StatelessWidget {
  final bool isLoggedIn;
  
  const MyApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Samajwadi Tech Force',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: const Color(0xFFE30512),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE30512),
          primary: const Color(0xFFE30512),
          secondary: const Color(0xFF009933),
        ),
        scaffoldBackgroundColor: Colors.white,
      ),
      home: isLoggedIn ? const MainNavigation() : const OnboardingScreen(),
    );
  }
}
