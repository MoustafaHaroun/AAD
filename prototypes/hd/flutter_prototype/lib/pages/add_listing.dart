import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_prototype/widgets/app_bar.dart';
import 'package:flutter_prototype/widgets/app_text_field.dart';
import '../data/listing.dart';
import '../data/listing_storage.dart';
import '../theme/app_colors.dart';
import '../theme/app_sizing.dart';
import '../widgets/bold_label.dart';
import '../widgets/primary_button.dart';
import 'take_picture_page.dart';

class AddListing extends StatelessWidget {
  const AddListing({super.key, this.existingListing, required this.camera});

  final CameraDescription camera;
  final Listing? existingListing;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppAppBar(),
      body: AddListingForm(camera: camera, existingPost: existingListing),
    );
  }
}

class AddListingForm extends StatefulWidget {
  const AddListingForm({super.key, this.existingPost, required this.camera});

  final CameraDescription camera;
  final Listing? existingPost;

  @override
  State<AddListingForm> createState() => _AddListingFormState();
}

class _AddListingFormState extends State<AddListingForm> {
  final List<XFile> _photos = [];

  late final TextEditingController _titleController;
  late final TextEditingController _descriptionController;
  final _storage = ListingStorage();

  @override
  void initState() {
    super.initState();

    _titleController = TextEditingController(
      text: widget.existingPost?.title ?? '',
    );
    _descriptionController = TextEditingController(
      text: widget.existingPost?.description ?? '',
    );
  }

  Future<void> _openCamera() async {
    final result = await Navigator.of(context).push<XFile>(
      MaterialPageRoute(builder: (_) => TakePicturePage(camera: widget.camera)),
    );

    if (result != null) {
      setState(() => _photos.add(result));
    }
  }

  Future<void> _savePost() async {
    final title = _titleController.text.trim();
    final description = _descriptionController.text.trim();

    if (title.isEmpty ||
        description.isEmpty ||
        (widget.existingPost == null && _photos.isEmpty)) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    final imagePaths = _photos.isNotEmpty
        ? _photos.map((e) => e.path).toList()
        : widget.existingPost!.imagePaths;

    final newListing = Listing(
      title: title,
      description: description,
      imagePaths: imagePaths,
    );

    if (widget.existingPost == null) {
      final existing = await _storage.loadListings();
      existing.add(newListing.toJson());
      await _storage.saveListings(existing);
    } else {
      await _storage.updateListing(widget.existingPost!, newListing);
    }

    if (!mounted) return;
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: AppSizes.md),
            const BoldLabel(value: "Title"),
            AppTextField(controller: _titleController),
            const SizedBox(height: AppSizes.md),
            const BoldLabel(value: "Description"),
            AppTextField(controller: _descriptionController, maxLines: 5),
            const SizedBox(height: AppSizes.lg),
            const BoldLabel(value: "Photos"),
            const SizedBox(height: AppSizes.sm),

            Wrap(
              spacing: AppSizes.sm,
              runSpacing: AppSizes.sm,
              children: [
                GestureDetector(
                  onTap: _openCamera,
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: AppColors.surfHued,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: const Icon(
                      Icons.add,
                      size: 32,
                      color: Colors.black54,
                    ),
                  ),
                ),

                ..._photos.map(
                  (photo) => ClipRRect(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    child: Image.file(
                      File(photo.path),
                      width: 64,
                      height: 64,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(AppSizes.md),
        child: PrimaryButton(label: 'Save', onTap: _savePost),
      ),
    );
  }
}
