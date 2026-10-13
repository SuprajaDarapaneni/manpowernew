import 'package:flutter_test/flutter_test.dart';
import 'package:customer_app/features/bookings/data/models/booking_model.dart';
import 'package:customer_app/features/bookings/domain/entities/booking_entity.dart';

void main() {
  group('BookingModel Tests', () {
    test('Correctly deserializes from JSON with 14-step booking parameters', () {
      final json = {
        'id': 'bk-test-101',
        'booking_number': 'MPL-101',
        'category_name': 'Warehouse Helpers',
        'required_workers': 4,
        'assigned_workers': 2,
        'status': 'matching',
        'shift_date': '2026-10-15',
        'start_time': '08:00 AM',
        'duration_hours': 8,
        'location_address': 'Sector 4, Logistics Park',
        'arrival_otp': '782914',
        'total_amount': 5760.0,
        'platform_fee': 576.0,
      };

      final model = BookingModel.fromJson(json);

      expect(model.id, equals('bk-test-101'));
      expect(model.bookingNumber, equals('MPL-101'));
      expect(model.requiredWorkers, equals(4));
      expect(model.assignedWorkers, equals(2));
      expect(model.status, equals(BookingStatus.matching));
      expect(model.arrivalOtp, equals('782914'));
      expect(model.totalAmount, equals(5760.0));
      expect(model.platformFee, equals(576.0));
    });
  });
}
