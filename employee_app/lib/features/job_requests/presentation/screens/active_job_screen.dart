import 'package:flutter/material.dart';
import '../services/worker_api_service.dart';

class ActiveJobScreen extends StatefulWidget {
  final VoidCallback onJobCompleted;

  const ActiveJobScreen({super.key, required this.onJobCompleted});

  @override
  State<ActiveJobScreen> createState() => _ActiveJobScreenState();
}

class _ActiveJobScreenState extends State<ActiveJobScreen> {
  final _service = WorkerApiService();
  final _otpController = TextEditingController();
  bool _isVerifying = false;

  void _verifyOtp() async {
    if (_otpController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please ask the employer for the 6-digit site arrival OTP')),
      );
      return;
    }
    setState(() => _isVerifying = true);
    final current = WorkerApiService.activeJob;
    final success = await _service.verifyArrivalOtp(current?.bookingId ?? 'bk-101', _otpController.text.trim());
    if (mounted) {
      setState(() => _isVerifying = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Site arrival verified! You can now start shift.')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid arrival OTP. Please confirm with employer.')),
        );
      }
    }
  }

  void _startShift() async {
    final current = WorkerApiService.activeJob;
    await _service.startShift(current?.bookingId ?? 'bk-101');
    setState(() {});
  }

  void _completeShift() async {
    final current = WorkerApiService.activeJob;
    await _service.completeShift(current?.bookingId ?? 'bk-101');
    setState(() {});
    if (mounted) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Shift Completed!'),
          content: Text('Your earnings of ₹${current?.wageAmount.toStringAsFixed(0) ?? "1440"} have been deposited to your wallet.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                widget.onJobCompleted();
              },
              child: const Text('View Earnings'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final job = WorkerApiService.activeJob;
    final status = WorkerApiService.shiftStatus;

    if (job == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Active Shift'), backgroundColor: const Color(0xFFD97706), foregroundColor: Colors.white),
        body: const Center(
          child: Text('No active shift. Accept a job from the Radar feed!', style: TextStyle(color: Colors.grey)),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Shift & Clock-In'),
        backgroundColor: const Color(0xFFD97706),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: status == 'in_progress'
                    ? const Color(0xFF0F766E)
                    : const Color(0xFFD97706),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.timer, color: Colors.white, size: 36),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        status == 'assigned'
                            ? 'Heading to Client Site'
                            : status == 'arrived'
                                ? 'Arrived on Site — Ready to Clock In'
                                : status == 'in_progress'
                                    ? 'Shift in Progress (03h 45m elapsed)'
                                    : 'Shift Completed',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(job.categoryName, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Job details
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Shift Particulars', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const Divider(height: 20),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.location_on, color: Color(0xFFD97706)),
                      title: const Text('Job Site Location'),
                      subtitle: Text(job.locationAddress),
                    ),
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.payments, color: Colors.green),
                      title: const Text('Guaranteed Worker Payout'),
                      subtitle: Text('₹${job.wageAmount.toStringAsFixed(0)} (${job.shiftDurationHours} hrs shift)'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // OTP Verification Step
            if (status == 'assigned') ...[
              Card(
                color: const Color(0xFFFEF3C7),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Step 1: Verify Site Arrival', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF92400E))),
                      const SizedBox(height: 6),
                      const Text('Ask the client supervisor at the location for their 6-digit Arrival OTP:', style: TextStyle(fontSize: 12, color: Color(0xFF78350F))),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        decoration: InputDecoration(
                          hintText: 'Enter 6-digit OTP (e.g. 482910)',
                          fillColor: Colors.white,
                          filled: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isVerifying ? null : _verifyOtp,
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFB45309), foregroundColor: Colors.white),
                          child: _isVerifying ? const CircularProgressIndicator(color: Colors.white) : const Text('Verify Arrival with Employer'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ] else if (status == 'arrived') ...[
              Card(
                color: const Color(0xFFCCFBF1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.check_circle, color: Color(0xFF0F766E)),
                          SizedBox(width: 8),
                          Text('Step 2: Clock-In to Begin Shift', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F766E))),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text('Arrival verified. Tap below to start your shift timer.', style: TextStyle(fontSize: 12)),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: _startShift,
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F766E), foregroundColor: Colors.white),
                          child: const Text('Start Work / Clock-In', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ] else if (status == 'in_progress') ...[
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text('Shift in Active Progress', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 8),
                      const Text('When your shift finishes, tap below to submit completed hours.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: _completeShift,
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                          child: const Text('Clock-Out & Request Payout', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
