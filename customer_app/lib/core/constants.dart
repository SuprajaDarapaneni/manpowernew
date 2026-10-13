class AppConstants {
  static const String appName = 'ManPowerLink Customer';
  static const String appVersion = '1.0.0';
  
  // Base API URL: 10.0.2.2 for Android Emulator, localhost for iOS simulator or web
  static const String defaultApiUrl = 'http://10.0.2.2:4000/api';
  static String apiUrl = defaultApiUrl;

  static const List<Map<String, dynamic>> defaultCategories = [
    {
      'id': 'cat-wh',
      'name': 'Warehouse Helper',
      'icon': 'warehouse',
      'hourlyRate': 180.0,
      'description': 'Pallet packing, stacking, sorting and dispatch helpers'
    },
    {
      'id': 'cat-lu',
      'name': 'Loading & Unloading',
      'icon': 'truck',
      'hourlyRate': 200.0,
      'description': 'Heavy cargo handling, container freight unloading'
    },
    {
      'id': 'cat-cs',
      'name': 'Construction Support',
      'icon': 'hard-hat',
      'hourlyRate': 190.0,
      'description': 'Material hauling, masonry support, on-site assistance'
    },
    {
      'id': 'cat-es',
      'name': 'Event Stewards',
      'icon': 'users',
      'hourlyRate': 220.0,
      'description': 'Event setup, crowd guidance, banquet support'
    },
    {
      'id': 'cat-ic',
      'name': 'Industrial Cleaning',
      'icon': 'sparkles',
      'hourlyRate': 175.0,
      'description': 'Facility sanitization, post-construction cleanup'
    },
  ];
}
