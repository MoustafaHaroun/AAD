import 'dart:convert';
import 'package:flutter_prototype/data/listing.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ListingStorage {
  static const _key = 'listings';

  Future<void> clearListings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }

  Future<List<Map<String, dynamic>>> loadListings() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_key);

    if (jsonString == null) return [];

    final List decoded = jsonDecode(jsonString);
    return decoded.cast<Map<String, dynamic>>();
  }

  Future<void> saveListings(List<Map<String, dynamic>> listings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(listings));
  }

  Future<void> deleteListing(Listing listing) async {
    final listings = await loadListings();
    listings.removeWhere(
      (p) =>
          p['title'] == listing.title &&
          p['description'] == listing.description &&
          p['imagePaths'] == listing.imagePaths,
    );

    await saveListings(listings);
  }

  Future<void> updateListing(Listing oldListing, Listing newListing) async {
    final listings = await loadListings();

    final index = listings.indexWhere(
      (p) =>
          p['title'] == oldListing.title &&
          p['description'] == oldListing.description &&
          p['imagePaths'] == oldListing.imagePaths,
    );

    if (index != -1) {
      listings[index] = newListing.toJson();
      await saveListings(listings);
    }
  }
}
