import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_prototype/pages/listing_details_page.dart';
import 'package:flutter_prototype/widgets/app_bar.dart';

import '../data/listing_storage.dart';
import '../main.dart';
import '../data/listing.dart';
import 'add_listing.dart';

class Listings extends StatefulWidget {
  const Listings({super.key});

  @override
  State<Listings> createState() => _ListingsState();
}

class _ListingsState extends State<Listings> {
  final _storage = ListingStorage();
  List<Listing> _listings = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadListings();
  }

  Future<void> _loadListings() async {
    setState(() => _loading = true);

    final raw = await _storage.loadListings();
    final listings = raw.map((e) => Listing.fromJson(e)).toList();

    setState(() {
      _listings = listings;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    var storage = ListingStorage();

    return Scaffold(
      appBar: AppAppBar(
        showBack: false,
        actions: [
          IconButton(
            onPressed: () => {storage.clearListings()},
            icon: const Icon(Icons.cleaning_services_rounded),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadListings,
              child: _listings.isEmpty
                  ? ListView(
                      children: const [Center(child: Text('No Listings yet'))],
                    )
                  : ListView.builder(
                      itemCount: _listings.length,
                      itemBuilder: (context, index) {
                        final listing = _listings[index];

                        return ListTile(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) =>
                                    ListingDetailsPage(listing: listing),
                              ),
                            );
                          },
                          leading: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: listing.imagePaths.isNotEmpty
                                ? Image.file(
                                    File(listing.imagePaths.first),
                                    width: 56,
                                    height: 56,
                                    fit: BoxFit.cover,
                                  )
                                : const SizedBox(width: 56, height: 56),
                          ),
                          title: Text(listing.title),
                          subtitle: Text(listing.description),
                        );
                      },
                    ),
            ),

      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => AddListing(camera: firstCamera)),
          );

          _loadListings(); // reload listings.
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
