import 'package:flutter/material.dart';
import 'features/auth/screens/customer_login_screen.dart';
import 'features/bookings/presentation/screens/customer_home_screen.dart';
import 'features/bookings/presentation/screens/create_booking_screen.dart';
import 'features/bookings/presentation/screens/active_bookings_screen.dart';
import 'features/profile/screens/customer_profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CustomerApp());
}

class CustomerApp extends StatefulWidget {
  const CustomerApp({super.key});

  @override
  State<CustomerApp> createState() => _CustomerAppState();
}

class _CustomerAppState extends State<CustomerApp> {
  bool _isLoggedIn = true; // Set to true for quick review, can toggle to test login

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ManPowerLink Customer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          primary: const Color(0xFF0F766E),
        ),
      ),
      home: _isLoggedIn
          ? CustomerMainNavigation(onLogout: () => setState(() => _isLoggedIn = false))
          : CustomerLoginScreen(onLoginSuccess: () => setState(() => _isLoggedIn = true)),
    );
  }
}

class CustomerMainNavigation extends StatefulWidget {
  final VoidCallback onLogout;

  const CustomerMainNavigation({super.key, required this.onLogout});

  @override
  State<CustomerMainNavigation> createState() => _CustomerMainNavigationState();
}

class _CustomerMainNavigationState extends State<CustomerMainNavigation> {
  int _currentIndex = 0;

  void _navigateToCreate() {
    setState(() => _currentIndex = 1);
  }

  void _navigateToBookings() {
    setState(() => _currentIndex = 2);
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      CustomerHomeScreen(
        onBookNowTap: _navigateToCreate,
        onViewBookingsTap: _navigateToBookings,
      ),
      CreateBookingScreen(
        onBookingCreated: _navigateToBookings,
      ),
      ActiveBookingsScreen(
        onNewBookingTap: _navigateToCreate,
      ),
      CustomerProfileScreen(
        onLogout: widget.onLogout,
      ),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.add_circle_outline), selectedIcon: Icon(Icons.add_circle), label: 'Post Job'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Bookings'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
