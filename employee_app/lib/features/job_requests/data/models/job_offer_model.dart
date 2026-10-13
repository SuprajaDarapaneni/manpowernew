import '../../domain/entities/job_offer_entity.dart';

class JobOfferModel extends JobOfferEntity {
  const JobOfferModel({
    required super.bookingId,
    required super.categoryName,
    required super.locationAddress,
    required super.distanceKm,
    required super.wageAmount,
    required super.shiftDurationHours,
    required super.shiftDate,
    required super.startTime,
    required super.requiredSkills,
  });

  factory JobOfferModel.fromJson(Map<String, dynamic> json) {
    return JobOfferModel(
      bookingId: json['booking_id'] as String? ?? json['id'] as String? ?? '',
      categoryName: json['category_name'] as String? ?? 'General Workforce',
      locationAddress: json['location_address'] as String? ?? 'Client Site',
      distanceKm: (json['distance_km'] as num?)?.toDouble() ?? 3.5,
      wageAmount: (json['wage_amount'] as num?)?.toDouble() ?? 1200.0,
      shiftDurationHours: (json['shift_duration_hours'] as num?)?.toInt() ?? 8,
      shiftDate: json['shift_date'] as String? ?? 'Today',
      startTime: json['start_time'] as String? ?? '09:00 AM',
      requiredSkills: (json['required_skills'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          ['General Assistance'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'booking_id': bookingId,
      'category_name': categoryName,
      'location_address': locationAddress,
      'distance_km': distanceKm,
      'wage_amount': wageAmount,
      'shift_duration_hours': shiftDurationHours,
      'shift_date': shiftDate,
      'start_time': startTime,
      'required_skills': requiredSkills,
    };
  }
}
