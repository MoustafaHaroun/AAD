import 'package:flutter/material.dart';

class BoldLabel extends StatelessWidget {
  const BoldLabel({
    super.key,
    required this.value,
    this.valueStyle,
  });

  final String value;
  final TextStyle? valueStyle;

  @override
  Widget build(BuildContext context) {
    return Text(
      value,
      style: valueStyle ??
          const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: Colors.black,
          ),
    );
  }
}
