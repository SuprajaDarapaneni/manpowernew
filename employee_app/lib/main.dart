import 'package:flutter/material.dart';
import 'features/auth/screens/employee_login_screen.dart';
import 'features/job_requests/presentation/screens/job_feed_screen.dart';
import 'features/job_requests/presentation/screens/active_job_screen.dart';
import 'features/earnings/presentation/screens/earnings_screen.dart';
import 'features/profile/presentation/screens/worker_profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const EmployeeApp());
}

class EmployeeApp extends StatefulWidget {
  const EmployeeApp({super.key});

  @override
  State<EmployeeApp> createState() => _EmployeeAppState();
}

class _EmployeeAppState extends State<EmployeeApp> {
  bool _isLoggedIn = true; // Enabled for fast review, toggle to test login screen

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ManPowerLink Worker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD97706),
          primary: const Color(0xFFD97706),
        ),
      ),
      home: _isLoggedIn
          ? EmployeeMainNavigation(onLogout: () => setState(() => _isLoggedIn = false))
          : EmployeeLoginScreen(onLoginSuccess: () => setState(() => _isLoggedIn = true)),
    );
  }
}

class EmployeeMainNavigation extends StatefulWidget {
  final VoidCallback onLogout;

  const EmployeeMainNavigation({super.key, required this.onLogout});

  @override
  State<EmployeeMainNavigation> createState() => _EmployeeMainNavigationState();
}

class _EmployeeMainNavigationState extends State<EmployeeMainNavigation> {
  int _currentIndex = 0;

  void _navigateToActiveShift() {
    setState(() => _currentIndex = 1);
  }

  void _navigateToEarnings() {
    setState(() => _currentIndex = 2);
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      JobFeedScreen(
        onJobAccepted: _navigateToActiveShift,
      ),
      ActiveJobScreen(
        onJobCompleted: _navigateToEarnings,
      ),
      const EarningsScreen(),
      WorkerProfileScreen(
        onLogout: widget.onLogout,
      ),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.radar_outlined), selectedIcon: Icon(Icons.radar), label: 'Shifts'),
          NavigationDestination(icon: Icon(Icons.timer_outlined), selectedIcon: Icon(Icons.timer), label: 'Active'),
          NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), selectedIcon: Icon(Icons.account_balance_wallet), label: 'Earnings'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
