import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/constants.dart';
import '../../domain/entities/booking_entity.dart';
import '../models/booking_model.dart';

class BookingApiService {
  // In-memory cache for smooth testing and offline resilience
  static final List<BookingModel> _localBookings = [
    BookingModel(
      id: 'bk-101',
      bookingNumber: 'MPL-882104',
      categoryName: 'Warehouse Helper',
      requiredWorkers: 4,
      assignedWorkers: 4,
      status: BookingStatus.inProgress,
      shiftDate: 'Today',
      startTime: '08:00 AM',
      durationHours: 8,
      locationAddress: 'Sector 4, Logistics Park, Bengaluru',
      arrivalOtp: '482910',
      totalAmount: 5760.0,
      platformFee: 576.0,
    ),
    BookingModel(
      id: 'bk-102',
      bookingNumber: 'MPL-882106',
      categoryName: 'Event Stewards',
      requiredWorkers: 2,
      assignedWorkers: 1,
      status: BookingStatus.matching,
      shiftDate: 'Tomorrow',
      startTime: '10:00 AM',
      durationHours: 6,
      locationAddress: 'Grand Palace Banquets, Palace Road',
      arrivalOtp: '391042',
      totalAmount: 2640.0,
      platformFee: 264.0,
    ),
  ];

  Future<List<BookingModel>> fetchBookings() async {
    try {
      final uri = Uri.parse('${AppConstants.apiUrl}/bookings');
      final res = await http.get(uri).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = (data['bookings'] as List<dynamic>?) ?? [];
        return list.map((e) => BookingModel.fromJson(e)).toList();
      }
    } catch (_) {
      // Graceful fallback to local bookings
    }
    return List.from(_localBookings);
  }

  Future<BookingModel> createBooking({
    required String categoryName,
    required int requiredWorkers,
    required int durationHours,
    required String locationAddress,
    required String shiftDate,
    required String startTime,
    required double hourlyRate,
  }) async {
    final double workerPay = requiredWorkers * durationHours * hourlyRate;
    final double fee = workerPay * 0.10;
    final double total = workerPay + fee;
    final String otp = (100000 + (DateTime.now().millisecondsSinceEpoch % 900000)).toString();
    final String bookingNum = 'MPL-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

    final newBooking = BookingModel(
      id: 'bk-${DateTime.now().millisecondsSinceEpoch}',
      bookingNumber: bookingNum,
      categoryName: categoryName,
      requiredWorkers: requiredWorkers,
      assignedWorkers: 0,
      status: BookingStatus.matching,
      shiftDate: shiftDate,
      startTime: startTime,
      durationHours: durationHours,
      locationAddress: locationAddress,
      arrivalOtp: otp,
      totalAmount: total,
      platformFee: fee,
    );

    try {
      final uri = Uri.parse('${AppConstants.apiUrl}/bookings');
      await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(newBooking.toJson()),
      ).timeout(const Duration(seconds: 3));
    } catch (_) {
      // Backend offline: store in local mock
    }

    _localBookings.insert(0, newBooking);
    return newBooking;
  }

  Future<bool> confirmCompletion(String bookingId) async {
    try {
      final uri = Uri.parse('${AppConstants.apiUrl}/bookings/$bookingId/complete');
      await http.post(uri).timeout(const Duration(seconds: 3));
    } catch (_) {}

    final idx = _localBookings.indexWhere((b) => b.id == bookingId);
    if (idx != -1) {
      final b = _localBookings[idx];
      _localBookings[idx] = BookingModel(
        id: b.id,
        bookingNumber: b.bookingNumber,
        categoryName: b.categoryName,
        requiredWorkers: b.requiredWorkers,
        assignedWorkers: b.assignedWorkers,
        status: BookingStatus.completed,
        shiftDate: b.shiftDate,
        startTime: b.startTime,
        durationHours: b.durationHours,
        locationAddress: b.locationAddress,
        arrivalOtp: b.arrivalOtp,
        totalAmount: b.totalAmount,
        platformFee: b.platformFee,
      );
      return true;
    }
    return false;
  }
}
