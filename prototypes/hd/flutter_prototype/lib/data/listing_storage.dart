import 'dart:convert';
import 'package:flutter_prototype/data/listing.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ListingStorage {
  static const _key = 'listings';

  Future<void> clearListings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }

  Future<List<Listing>> loadListings() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_key);

    if (jsonString == null) return [];

    final List decoded = jsonDecode(jsonString);
    return decoded.map((e) => Listing.fromJson(e)).toList();
  }

  Future<void> saveListings(List<Listing> listings) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = listings.map((e) => e.toJson()).toList();
    await prefs.setString(_key, jsonEncode(jsonList));
  }

  Future<void> deleteListing(String id) async {
    final listings = await loadListings();
    listings.removeWhere((l) => l.id == id);
    await saveListings(listings);
  }

  Future<void> updateListing(Listing updatedListing) async {
    final listings = await loadListings();

    final index = listings.indexWhere((l) => l.id == updatedListing.id);

    if (index != -1) {
      listings[index] = updatedListing;
      await saveListings(listings);
    }
  }

  Future<void> addListing(Listing listing) async {
    final listings = await loadListings();
    listings.add(listing);
    await saveListings(listings);
  }
}
