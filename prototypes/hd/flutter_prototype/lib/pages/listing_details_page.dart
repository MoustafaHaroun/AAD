import 'dart:io';
import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../data/listing_storage.dart';
import '../main.dart';
import '../data/listing.dart';
import '../theme/app_sizing.dart';
import '../widgets/app_bar.dart';
import 'add_listing.dart';

class ListingDetailsPage extends StatelessWidget {
  const ListingDetailsPage({super.key, required this.listing});

  final Listing listing;

  Future<void> _shareListing() async {
    await SharePlus.instance.share(
      ShareParams(
        files: listing.imagePaths.map((p) => XFile(p)).toList(),
        text: '${listing.title}\n\n${listing.description}',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final storage = ListingStorage();

    return Scaffold(
      appBar: AppAppBar(
        actions: [
          IconButton(icon: const Icon(Icons.share), onPressed: _shareListing),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () async {
              await storage.deleteListing(listing);
              if (!context.mounted) return;
              Navigator.pop(context, true);
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.edit),
        onPressed: () async {
          final updated = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) =>
                  AddListing(camera: firstCamera, existingListing: listing),
            ),
          );

          if (updated == true && context.mounted) {
            Navigator.pop(context, true);
          }
        },
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (listing.imagePaths.isNotEmpty)
              SizedBox(
                height: 280,
                child: PageView(
                  children: listing.imagePaths
                      .map(
                        (path) => ClipRRect(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          child: Image.file(
                            File(path),
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),

            const SizedBox(height: AppSizes.md),
            Text(
              listing.title,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: AppSizes.sm),
            Text(listing.description),
          ],
        ),
      ),
    );
  }
}
