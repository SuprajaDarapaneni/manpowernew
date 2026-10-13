import 'package:flutter/material.dart';

class WorkerProfileScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const WorkerProfileScreen({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Worker Profile & Trade'),
        backgroundColor: const Color(0xFFD97706),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 40,
              backgroundColor: Color(0xFFFEF3C7),
              child: Icon(Icons.person, size: 44, color: Color(0xFFD97706)),
            ),
          ),
          const SizedBox(height: 12),
          const Center(
            child: Text('Ramesh Gowda', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const Center(
            child: Text('+91 98765 43210 • 4.9 ★ (142 shifts)', style: TextStyle(fontSize: 13, color: Colors.grey)),
          ),
          const SizedBox(height: 20),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.verified, color: Colors.green),
                  title: const Text('Govt KYC Verification'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(6)),
                    child: const Text('Aadhaar & Police Verified', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.handyman),
                  title: Text('Primary Trade Skill'),
                  subtitle: Text('Warehouse Logistics & Pallet Stacking'),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.account_balance),
                  title: Text('Bank Payout Account'),
                  subtitle: Text('SBI Bank (Account ending in 4812)'),
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
            label: const Text('Log Out of Worker Account'),
          ),
        ],
      ),
    );
  }
}
