import 'package:flutter/material.dart';
import '../../../../core/constants.dart';
import '../../data/services/booking_api_service.dart';

class CreateBookingScreen extends StatefulWidget {
  final VoidCallback onBookingCreated;

  const CreateBookingScreen({super.key, required this.onBookingCreated});

  @override
  State<CreateBookingScreen> createState() => _CreateBookingScreenState();
}

class _CreateBookingScreenState extends State<CreateBookingScreen> {
  final _service = BookingApiService();
  final _addressController = TextEditingController(text: 'Warehouse 4B, Electronic City, Bengaluru');
  
  Map<String, dynamic> _selectedCategory = AppConstants.defaultCategories[0];
  int _workersCount = 3;
  int _durationHours = 8;
  String _shiftDate = 'Today';
  String _startTime = '09:00 AM';
  bool _isSubmitting = false;

  double get _hourlyRate => (_selectedCategory['hourlyRate'] as num).toDouble();
  double get _subtotal => _workersCount * _durationHours * _hourlyRate;
  double get _platformFee => _subtotal * 0.10;
  double get _totalAmount => _subtotal + _platformFee;

  void _handleSubmit() async {
    setState(() => _isSubmitting = true);
    final booking = await _service.createBooking(
      categoryName: _selectedCategory['name'],
      requiredWorkers: _workersCount,
      durationHours: _durationHours,
      locationAddress: _addressController.text.trim(),
      shiftDate: _shiftDate,
      startTime: _startTime,
      hourlyRate: _hourlyRate,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Color(0xFF0F766E)),
              SizedBox(width: 8),
              Text('Booking Dispatched!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Booking #${booking.bookingNumber} is now matching with workers within 25km radius.'),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Shift Arrival OTP (Share with workers on arrival):', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    const SizedBox(height: 4),
                    Text(booking.arrivalOtp, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 4, color: Color(0xFF0F766E))),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                widget.onBookingCreated();
              },
              child: const Text('View Active Bookings'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book Temporary Staff'),
        backgroundColor: const Color(0xFF0F766E),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('1. Select Trade Category', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            DropdownButtonFormField<Map<String, dynamic>>(
              value: _selectedCategory,
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              items: AppConstants.defaultCategories.map((c) {
                return DropdownMenuItem(
                  value: c,
                  child: Text('${c['name']} (₹${c['hourlyRate']}/hr)'),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedCategory = val);
              },
            ),
            const SizedBox(height: 20),

            const Text('2. Number of Workers Needed', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Row(
              children: [
                Expanded(
                  child: Slider(
                    value: _workersCount.toDouble(),
                    min: 1,
                    max: 20,
                    divisions: 19,
                    activeColor: const Color(0xFF0F766E),
                    label: '$_workersCount Workers',
                    onChanged: (val) => setState(() => _workersCount = val.toInt()),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFCCFBF1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('$_workersCount Workers', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F766E))),
                ),
              ],
            ),
            const SizedBox(height: 16),

            const Text('3. Shift Duration & Timing', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [4, 8, 12].map((hrs) {
                final isSelected = _durationHours == hrs;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: isSelected ? const Color(0xFF0F766E) : Colors.transparent,
                        foregroundColor: isSelected ? Colors.white : Colors.black87,
                        side: BorderSide(color: isSelected ? const Color(0xFF0F766E) : Colors.grey.shade300),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => setState(() => _durationHours = hrs),
                      child: Text('$hrs Hours'),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            const Text('4. Site Address & Location', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _addressController,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.location_on, color: Color(0xFF0F766E)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 24),

            // Cost Summary Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text('Workers Pay ($_workersCount × $_durationHours hrs × ₹$_hourlyRate)'),
                      Text('₹${_subtotal.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Platform Guarantee Fee (10%)'),
                      Text('₹${_platformFee.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const Divider(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Total Estimated Escrow', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Text('₹${_totalAmount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F766E))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F766E),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Confirm & Dispatch Shift (Live Escrow)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
