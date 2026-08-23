# Trade2

## Prerequisites
See the [React Native documentation on setting up environment](https://reactnative.dev/docs/set-up-your-environment) on how to set up your machine for React Native Expo development.

## Installation
```bash
npm install
```
Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_BASE_URL` to the backend to test against (see below), then run:
```bash
npm run android
npm run ios
```
This was tested on Android devices.

## Testing against the hosted backend
- Server URL: `https://api.mufasadev.nl`
- Regular account: register your own through the app's registration flow.
- Test user account: `test@trade2.com` / `Test123!`
- Admin account: `admin@trade2.com` / `Admin123!`

## Quality
```bash
npm run lint:check   # static analysis
npm test             # automated tests
```