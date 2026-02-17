class Listing {
  final String id;
  final String title;
  final String description;
  final List<String> imagePaths;

  Listing({
    String? id,
    required this.title,
    required this.description,
    required this.imagePaths,
  }) : id = id ?? DateTime.now().millisecondsSinceEpoch.toString();

  factory Listing.fromJson(Map<String, dynamic> json) => Listing(
    id: json['id'],
    title: json['title'],
    description: json['description'],
    imagePaths: List<String>.from(json['imagePaths']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'imagePaths': imagePaths,
  };
}
