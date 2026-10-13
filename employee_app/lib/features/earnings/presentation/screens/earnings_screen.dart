import 'package:flutter/material.dart';

class EarningsScreen extends StatelessWidget {
  const EarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Earnings & Payouts'),
        backgroundColor: const Color(0xFFD97706),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Wallet Balance Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFD97706), Color(0xFFB45309)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Available Wallet Balance', style: TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(height: 6),
                const Text('₹14,850.00', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Instant UPI transfer initiated to State Bank of India (***4812)')),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFFB45309),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Instant Withdraw', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text('Recent Shift Settlements', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...[
            {'role': 'Warehouse Helper (8 hrs)', 'date': 'Today, Oct 12', 'amount': '₹1,440.00', 'status': 'Settled'},
            {'role': 'Loading & Unloading (8 hrs)', 'date': 'Yesterday, Oct 11', 'amount': '₹1,600.00', 'status': 'Settled'},
            {'role': 'Construction Support (8 hrs)', 'date': 'Oct 09', 'amount': '₹1,520.00', 'status': 'Settled'},
            {'role': 'Event Steward (6 hrs)', 'date': 'Oct 07', 'amount': '₹1,320.00', 'status': 'Settled'},
          ].map((item) => Card(
                margin: const EdgeInsets.only(bottom: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFFEF3C7),
                    child: Icon(Icons.check, color: Color(0xFFD97706)),
                  ),
                  title: Text(item['role']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(item['date']!),
                  trailing: Text(item['amount']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.green)),
                ),
              )),
        ],
      ),
    );
  }
}
