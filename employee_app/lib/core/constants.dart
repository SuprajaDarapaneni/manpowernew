class EmployeeConstants {
  static const String appName = 'ManPowerLink Worker';
  static const String appVersion = '1.0.0';

  // Base API URL: 10.0.2.2 for Android Emulator, localhost for iOS simulator or web
  static const String defaultApiUrl = 'http://10.0.2.2:4000/api';
  static String apiUrl = defaultApiUrl;

  static const List<String> skillCategories = [
    'Warehouse Helper',
    'Loading & Unloading',
    'Construction Support',
    'Event Stewards',
    'Industrial Cleaning',
    'Masonry & Concrete',
    'Packing & Moving',
  ];
}
