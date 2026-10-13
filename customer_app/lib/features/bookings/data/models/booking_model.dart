import '../../domain/entities/booking_entity.dart';

class BookingModel extends BookingEntity {
  const BookingModel({
    required super.id,
    required super.bookingNumber,
    required super.categoryName,
    required super.requiredWorkers,
    required super.assignedWorkers,
    required super.status,
    required super.shiftDate,
    required super.startTime,
    required super.durationHours,
    required super.locationAddress,
    required super.arrivalOtp,
    required super.totalAmount,
    required super.platformFee,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String? ?? '',
      bookingNumber: json['booking_number'] as String? ?? '',
      categoryName: json['category_name'] as String? ?? 'General Staff',
      requiredWorkers: (json['required_workers'] as num?)?.toInt() ?? 1,
      assignedWorkers: (json['assigned_workers'] as num?)?.toInt() ?? 0,
      status: BookingStatus.fromString(json['status'] as String?),
      shiftDate: json['shift_date'] as String? ?? '',
      startTime: json['start_time'] as String? ?? '',
      durationHours: (json['duration_hours'] as num?)?.toInt() ?? 8,
      locationAddress: json['location_address'] as String? ?? '',
      arrivalOtp: json['arrival_otp'] as String? ?? '123456',
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      platformFee: (json['platform_fee'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_number': bookingNumber,
      'category_name': categoryName,
      'required_workers': requiredWorkers,
      'assigned_workers': assignedWorkers,
      'status': status.name,
      'shift_date': shiftDate,
      'start_time': startTime,
      'duration_hours': durationHours,
      'location_address': locationAddress,
      'arrival_otp': arrivalOtp,
      'total_amount': totalAmount,
      'platform_fee': platformFee,
    };
  }
}
