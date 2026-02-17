import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_sizing.dart';

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final double height;
  final BorderRadiusGeometry borderRadius;

  const PrimaryButton({
    super.key,
    required this.label,
    required this.onTap,
    this.height = 56,
    this.borderRadius = const BorderRadius.vertical(top: Radius.circular(16)),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: const BoxDecoration(
        gradient: AppGradients.primGrad,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppRadius.md),
          child: Center(
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
