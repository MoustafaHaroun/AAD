import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_prototype/pages/listings_page.dart';
import 'package:flutter_prototype/theme/app_theme.dart';

late final CameraDescription firstCamera;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final cameras = await availableCameras();
  firstCamera = cameras.first;

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Prototype',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: Listings(),
    );
  }
}
