# Trade2

## Prerequisites

* Node.js 11 or higher
* npm
* Android SDK (installed via Android Studio)

---

## Usage

This project uses native packages that are not supported by Expo Go. Because of this, the app must be run using a local Android (or iOS) build instead of the standard Expo development server.

### Android setup

Before running the app, you need to link your Android SDK:

Create the file:

```
android/local.properties
```

Add the following (adjust the path if needed):

```
sdk.dir=C:\\Users\\Moust\\AppData\\Local\\Android\\Sdk
```

---

## Running the app

Use the following commands to start the application:

```bash
npm run android
npm run ios # not tested
```

* `npm run android` builds and runs the app on a connected Android device or emulator
* `npm run ios` may require additional setup and has not been tested

---

## Notes

* An Android device with USB debugging enabled or a running emulator is required
* Expo Go cannot be used due to native module dependencies
