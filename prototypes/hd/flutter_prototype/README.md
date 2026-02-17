## Flutter Prototype — AAD

### Overview

This repository contains a Flutter prototype for **Trade2**, developed for the *Advanced App Development* course at Saxion University of Applied Sciences. The app demonstrates core mobile concepts such as local persistence, CRUD operations, and native integrations.

---

## Platform Support

The project targets both Android and iOS.

* ✅ **Android:** Tested on physical devices and emulators
* ⚠️ **iOS:** Supported by the project configuration but not tested due to the lack of an available iPhone

---

## Installation and Running

### Prerequisites

* Flutter SDK
* Android Studio or VS Code with Flutter extensions
* Android emulator or physical device

### Steps

1. Clone the repository
2. Open the project folder
3. Run `flutter pub get`
4. Start an emulator or connect a device
5. Run `flutter run`

---

## Functionality

### Local Data Persistence

Listings are stored locally using **SharedPreferences**, ensuring data remains available after closing the app.

### Listing Management

Users can:

* View all listings
* Create listings with title, description, and photos
* Edit existing listings
* Delete listings

### Styling

The interface uses reusable components, consistent spacing, and a clear hierarchy to provide a clean, native-feeling UI.

### Native Interaction

The app integrates device capabilities:

* Camera access for capturing photos
* Local file storage for saving images

### Design Essentials

The UI aligns with the defined branding and visual guidelines from the Design Essentials track.

### Share Functionality

Listings can be shared via the device’s native share dialog, allowing content to be sent to other apps such as messaging or email.
