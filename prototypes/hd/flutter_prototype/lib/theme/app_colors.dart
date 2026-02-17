import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary colors
  static const primary = Color(0xFFF7DF6E);    // main brand color
  static const onPrimary = Color(0xFF38362E);  // foreground text/icons on primary

  static const primDesat = Color(0xFFEBE0AD);  // desaturated primary
  static const surfHued = Color(0xFFEDEBE3);   // surface hue
  static const foreHued = Color(0xFF38362E);   // foreground hue

  // Text colors
  static const textPrimary = Color(0xFF38362E);
  static const textSecondary = Color(0xFF49454F);

  // Misc
  static const border = Color(0xFF38362E) ;
  static const error = Color(0xFFB3261E);
}

// Gradients
class AppGradients {
  AppGradients._();

  static const primGrad = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFFCC010),  // primary gradient color
      Color(0xFFF28D1B),  // secondary gradient color
    ],
  );
}
