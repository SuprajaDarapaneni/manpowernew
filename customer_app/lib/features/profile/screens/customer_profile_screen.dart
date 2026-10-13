import 'package:flutter/material.dart';

class CustomerProfileScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const CustomerProfileScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Company Profile'),
        backgroundColor: const Color(0xFF0F766E),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 40,
              backgroundColor: Color(0xFFCCFBF1),
              child: Icon(Icons.business, size: 40, color: Color(0xFF0F766E)),
            ),
          ),
          const SizedBox(height: 12),
          const Center(
            child: Text('Kiran Transport & Co', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const Center(
            child: Text('+91 98450 11223 • Employer Account', style: TextStyle(fontSize: 13, color: Colors.grey)),
          ),
          const SizedBox(height: 24),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.verified_user, color: Colors.green),
                  title: const Text('Verification Status'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text('GSTIN Verified', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.location_city),
                  title: Text('Registered Hub'),
                  subtitle: Text('Electronic City Sector 4, Bengaluru, KA'),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.security),
                  title: Text('Security Escrow Balance'),
                  subtitle: Text('₹25,000.00 (Platform Guaranteed)'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: onLogout,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade50,
              foregroundColor: Colors.red.shade700,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.logout),
            label: const Text('Log Out of Employer Account'),
          ),
        ],
      ),
    );
  }
}
