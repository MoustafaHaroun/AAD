import 'package:flutter/material.dart';

import '../theme/app_sizing.dart';

class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    this.controller,
    this.maxLines = 1,
    this.decoration,
  });

  final TextEditingController? controller;
  final int maxLines;
  final InputDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: decoration ??
          InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: const BorderSide(
                width: 2.0,
                color: Colors.black,
              ),
            ),
            contentPadding: const EdgeInsets.all(AppSizes.md),
          ),
    );
  }
}
