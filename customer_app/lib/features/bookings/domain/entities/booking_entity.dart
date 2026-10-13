enum BookingStatus {
  created,
  matching,
  assigned,
  arrived,
  inProgress,
  completed,
  cancelled;

  static BookingStatus fromString(String? val) {
    switch (val?.toLowerCase()) {
      case 'matching':
        return BookingStatus.matching;
      case 'assigned':
        return BookingStatus.assigned;
      case 'arrived':
        return BookingStatus.arrived;
      case 'in_progress':
      case 'inprogress':
        return BookingStatus.inProgress;
      case 'completed':
        return BookingStatus.completed;
      case 'cancelled':
        return BookingStatus.cancelled;
      default:
        return BookingStatus.created;
    }
  }

  String get label {
    switch (this) {
      case BookingStatus.matching:
        return 'Matching Workers';
      case BookingStatus.assigned:
        return 'Workers Assigned';
      case BookingStatus.arrived:
        return 'Workers Arrived';
      case BookingStatus.inProgress:
        return 'Shift in Progress';
      case BookingStatus.completed:
        return 'Completed';
      case BookingStatus.cancelled:
        return 'Cancelled';
      case BookingStatus.created:
        return 'Booking Created';
    }
  }
}

class BookingEntity {
  final String id;
  final String bookingNumber;
  final String categoryName;
  final int requiredWorkers;
  final int assignedWorkers;
  final BookingStatus status;
  final String shiftDate;
  final String startTime;
  final int durationHours;
  final String locationAddress;
  final String arrivalOtp;
  final double totalAmount;
  final double platformFee;

  const BookingEntity({
    required this.id,
    required this.bookingNumber,
    required this.categoryName,
    required this.requiredWorkers,
    required this.assignedWorkers,
    required this.status,
    required this.shiftDate,
    required this.startTime,
    required this.durationHours,
    required this.locationAddress,
    required this.arrivalOtp,
    required this.totalAmount,
    required this.platformFee,
  });
}
