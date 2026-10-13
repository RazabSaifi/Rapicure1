# RapiCure AI - Mobile App Guide (Android & iOS)

RapiCure AI can be used directly as a mobile app on Android phones, iPhones, and tablets, or exported into an Android APK / Google Play package.

---

## 1. Instant 1-Click Install (Android WebAPK & iOS PWA)

No App Store or APK download needed — you get a real launcher icon, standalone full-screen window, and full microphone/camera access:

### On Android (Chrome / Edge / Brave):
1. Open the app link in Chrome on your phone.
2. Tap the **"Get App"** button at the top/bottom or tap the Chrome menu (**⋮**).
3. Select **"Install app"** (or **"Add to Home screen"**).
4. Android will generate a native WebAPK with the **RapiCure** medical icon and install it into your app drawer.
5. Launching it opens in full standalone mode without any browser URL bar.

### On iOS (Safari):
1. Open the app in Safari on your iPhone/iPad.
2. Tap the **Share button** (square with an arrow pointing up).
3. Tap **"Add to Home Screen"**.
4. Tap **"Add"**.

---

## 2. Generating an Android APK / Google Play Bundle (AAB)

We have pre-configured `manifest.json` and `capacitor.config.json` in this repository.

### Option A: Google Bubblewrap CLI (Fastest TWA APK)
```bash
# Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# Initialize project with your manifest
bubblewrap init --manifest=https://your-domain.com/manifest.json

# Build the signed APK and AAB
bubblewrap build
```
This produces:
- `app-release-signed.apk` (install directly on any Android device via `adb install` or file transfer)
- `app-release-bundle.aab` (ready for Google Play Store console)

### Option B: Ionic Capacitor (Full Android Studio Project)
```bash
# 1. Install Capacitor Android dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build Next.js assets
npm run build

# 3. Add Android platform
npx cap add android

# 4. Open in Android Studio
npx cap open android
```
Inside Android Studio:
- Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- Run directly on any connected physical Android phone or emulator.

---

## Mobile Features Included in this Build
- **Adaptive Mobile Layout**: Dual-column workspace on desktop, bottom navigation bar & swipeable module tabs on smartphones.
- **Microphone Voice Scribe**: Real-time Hindi & English conversational AI dialogue.
- **Camera Lab OCR**: Attach lab reports and prescriptions directly via phone camera or gallery.
- **Offline Service Worker**: Instant load caching via `public/sw.js`.
