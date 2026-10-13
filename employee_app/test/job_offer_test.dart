import 'package:flutter_test/flutter_test.dart';
import 'package:employee_app/features/job_requests/domain/entities/job_offer_entity.dart';

void main() {
  group('JobOfferEntity Tests', () {
    test('Constructs valid JobOfferEntity with wage and distance calculations', () {
      const offer = JobOfferEntity(
        bookingId: 'bk-99',
        categoryName: 'Warehouse Logistics Helpers',
        locationAddress: 'Warehouse 4B, Sector 5',
        distanceKm: 2.5,
        wageAmount: 1440.0,
        shiftDurationHours: 8,
        shiftDate: 'Today, 2:00 PM',
        startTime: '14:00',
        requiredSkills: ['Pallet Stacking', 'Loading/Unloading'],
      );

      expect(offer.bookingId, equals('bk-99'));
      expect(offer.distanceKm, equals(2.5));
      expect(offer.wageAmount, equals(1440.0));
      expect(offer.shiftDurationHours, equals(8));
      expect(offer.requiredSkills.length, equals(2));
    });
  });
}
