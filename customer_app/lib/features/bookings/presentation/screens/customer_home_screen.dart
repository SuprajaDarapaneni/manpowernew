import 'package:flutter/material.dart';
import '../../../../core/constants.dart';

class CustomerHomeScreen extends StatelessWidget {
  final VoidCallback onBookNowTap;
  final VoidCallback onViewBookingsTap;

  const CustomerHomeScreen({
    super.key,
    required this.onBookNowTap,
    required this.onViewBookingsTap,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.business_center, color: Colors.white),
            SizedBox(width: 8),
            Text('ManPowerLink'),
          ],
        ),
        backgroundColor: const Color(0xFF0F766E),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F766E), Color(0xFF115E59)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Employer Portal', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 4),
                  const Text('On-Demand Workforce', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Verified helpers dispatched in 25km radius. Zero agency delays.', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: onBookNowTap,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF0F766E),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.flash_on),
                    label: const Text('Post Immediate Shift', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Category section
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('Trade Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton(
                  onPressed: onBookNowTap,
                  child: const Text('Book Custom'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: AppConstants.defaultCategories.length,
              itemBuilder: (context, index) {
                final cat = AppConstants.defaultCategories[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFFCCFBF1),
                      child: Icon(Icons.handyman, color: Color(0xFF0F766E)),
                    ),
                    title: Text(cat['name'], style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text(cat['description'], maxLines: 1, overflow: TextOverflow.ellipsis),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('₹${cat['hourlyRate']}/hr', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F766E))),
                        const Text('Per worker', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                    onTap: onBookNowTap,
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
