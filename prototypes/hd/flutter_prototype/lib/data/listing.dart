class Listing {
  final String title;
  final String description;
  final List<String> imagePaths;

  Listing({
    required this.title,
    required this.description,
    required this.imagePaths,
  });

  factory Listing.fromJson(Map<String, dynamic> json) => Listing(
    title: json['title'],
    description: json['description'],
    imagePaths: List<String>.from(json['imagePaths']),
  );

  Map<String, dynamic> toJson() => {
    'title': title,
    'description': description,
    'imagePaths': imagePaths,
  };
}
