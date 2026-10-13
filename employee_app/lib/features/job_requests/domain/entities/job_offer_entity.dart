class JobOfferEntity {
  final String bookingId;
  final String categoryName;
  final String locationAddress;
  final double distanceKm;
  final double wageAmount;
  final int shiftDurationHours;
  final String shiftDate;
  final String startTime;
  final List<String> requiredSkills;

  const JobOfferEntity({
    required this.bookingId,
    required this.categoryName,
    required this.locationAddress,
    required this.distanceKm,
    required this.wageAmount,
    required this.shiftDurationHours,
    required this.shiftDate,
    required this.startTime,
    required this.requiredSkills,
  });
}
