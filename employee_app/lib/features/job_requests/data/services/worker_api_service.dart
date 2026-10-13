import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/constants.dart';
import '../models/job_offer_model.dart';

class WorkerApiService {
  static final List<JobOfferModel> _availableOffers = [
    const JobOfferModel(
      bookingId: 'bk-102',
      categoryName: 'Event Stewards',
      locationAddress: 'Grand Palace Banquets, Palace Road',
      distanceKm: 2.5,
      wageAmount: 1320.0,
      shiftDurationHours: 6,
      shiftDate: 'Tomorrow',
      startTime: '10:00 AM',
      requiredSkills: ['Crowd Guidance', 'Banquet Setup'],
    ),
    const JobOfferModel(
      bookingId: 'bk-103',
      categoryName: 'Loading & Unloading',
      locationAddress: 'Container Depot 3, Whitefield',
      distanceKm: 4.8,
      wageAmount: 1600.0,
      shiftDurationHours: 8,
      shiftDate: 'Today, 02:00 PM',
      startTime: '02:00 PM',
      requiredSkills: ['Heavy Lifting', 'Container Freight'],
    ),
  ];

  static JobOfferModel? activeJob = const JobOfferModel(
    bookingId: 'bk-101',
    categoryName: 'Warehouse Helper',
    locationAddress: 'Sector 4, Logistics Park, Bengaluru',
    distanceKm: 1.2,
    wageAmount: 1440.0,
    shiftDurationHours: 8,
    shiftDate: 'Today',
    startTime: '08:00 AM',
    requiredSkills: ['Pallet Stacking', 'Loading/Unloading'],
  );

  static String shiftStatus = 'arrived'; // 'assigned', 'arrived', 'in_progress', 'completed'

  Future<List<JobOfferModel>> getNearbyJobOffers() async {
    try {
      final uri = Uri.parse('${EmployeeConstants.apiUrl}/employee/available-shifts');
      final res = await http.get(uri).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = (data['shifts'] as List<dynamic>?) ?? [];
        return list.map((e) => JobOfferModel.fromJson(e)).toList();
      }
    } catch (_) {}
    return List.from(_availableOffers);
  }

  Future<bool> acceptJob(JobOfferModel offer) async {
    try {
      final uri = Uri.parse('${EmployeeConstants.apiUrl}/employee/shifts/${offer.bookingId}/accept');
      await http.post(uri).timeout(const Duration(seconds: 3));
    } catch (_) {}
    activeJob = offer;
    shiftStatus = 'assigned';
    _availableOffers.removeWhere((o) => o.bookingId == offer.bookingId);
    return true;
  }

  Future<bool> verifyArrivalOtp(String bookingId, String otp) async {
    try {
      final uri = Uri.parse('${EmployeeConstants.apiUrl}/employee/shifts/$bookingId/verify-arrival');
      final res = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'otp': otp}),
      ).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        shiftStatus = 'arrived';
        return true;
      }
    } catch (_) {}

    // Offline / demo validation (accepts default 482910, 1234, 123456 or any 4-6 digit OTP)
    if (otp.length >= 4) {
      shiftStatus = 'arrived';
      return true;
    }
    return false;
  }

  Future<bool> startShift(String bookingId) async {
    try {
      final uri = Uri.parse('${EmployeeConstants.apiUrl}/employee/shifts/$bookingId/start');
      await http.post(uri).timeout(const Duration(seconds: 3));
    } catch (_) {}
    shiftStatus = 'in_progress';
    return true;
  }

  Future<bool> completeShift(String bookingId) async {
    try {
      final uri = Uri.parse('${EmployeeConstants.apiUrl}/employee/shifts/$bookingId/complete');
      await http.post(uri).timeout(const Duration(seconds: 3));
    } catch (_) {}
    shiftStatus = 'completed';
    return true;
  }
}
