# 🏋️ FITECH React Native Project

Welcome to the **FITECH** React Native app! This guide will help you set up the project and run it locally on your simulator.

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>/fitech
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ (Optional) Install EAS CLI

If you want to generate APKs (Android) or IPAs (iOS):

```bash
npm install -g eas-cli
```

> **Note:** You will need an [Expo account](https://expo.dev) to use EAS for builds.

---

### 4️⃣ Xcode and iOS Simulator setup

✅ Make sure **Xcode** is fully installed from the App Store.  
✅ Verify your developer directory:

```bash
xcode-select -p
```

➡ Expected output:

```
/Applications/Xcode.app/Contents/Developer
```

❗ If it shows something like `/Library/Developer/CommandLineTools`, fix it:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

✅ Accept Xcode license (if needed):

```bash
sudo xcodebuild -license accept
```

✅ Check Xcode version:

```bash
xcodebuild -version
```

➡ You should see:

```
Xcode <your-version>
Build version <your-build-version>
```

---

### 5️⃣ Run the project

Start the development server:

```bash
npm start
```

➡ When prompted, select:

```
ios
```

➡ The app will open in your iOS simulator.

---

## ⚠️ Troubleshooting

- **Simulator won’t open?**  
  Make sure Xcode and its Command Line Tools are installed and configured (see step 4).

- **Error about `xcodebuild` or developer directory?**

  ```
  xcodebuild: error: tool 'xcodebuild' requires Xcode, but active developer directory is a command line tools instance
  ```

  👉 Fix it:

  ```bash
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  ```

---

## 📦 Building APK / IPA

Once EAS CLI is installed and you're logged into Expo:

```bash
eas build --platform android --profile apk
```

or

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

➡ Learn more at [Expo Application Services](https://expo.dev/eas).
