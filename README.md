# Guardian Assistant - Expo Prototype 📱

Welcome to the **Guardian Assistant** prototype, a daily companion application designed for parents and guardians to manage child schedules, report school absences, and communicate with teachers. 

This mobile application is built using **Expo (SDK 56)**, **React Native**, and **TypeScript**, leveraging modern file-based routing.

---

## 🚀 Getting Started on macOS

To run this prototype locally on your Mac, follow the setup and installation instructions below.

### 📋 Prerequisites

Before running the application, make sure you have the following installed on your Mac:

1. **Node.js**: Recommended version is **Node.js 20.x (LTS) or v22.x**.
   * Check your version: `node -v`
2. **Watchman**: A tool by Meta for watching file changes. Essential for smooth Expo reloading on macOS.
   * Install via Homebrew: `brew install watchman`
3. **Package Manager**: This project uses **npm** (comes packaged with Node.js).

---

### 💻 Platform Setup

Depending on how you wish to run the app, complete one or more of the setups below:

#### 1. Running on iOS Simulator (Recommended)
This prototype includes a custom simulator device patch. By default, it expects the **iPhone 16 Pro** simulator.
* Install **Xcode** from the Mac App Store.
* Open Xcode once to accept the license agreements, or run:
  ```bash
  sudo xcodebuild -license accept
  ```
* Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
* Ensure you have the **iPhone 16 Pro** simulator runtime installed (Xcode -> Settings -> Platforms -> iOS).

#### 2. Running on a Physical Device (iOS/Android)
This is the easiest way to test the prototype without setting up Xcode or Android Studio.
* Download the **Expo Go** app from the Apple App Store or Google Play Store on your mobile device.
* Ensure both your Mac and your mobile device are connected to the **same Wi-Fi network**.

#### 3. Running on Android Emulator
* Download and install **Android Studio**.
* Set up an Android Virtual Device (AVD) using the Device Manager in Android Studio.
* Ensure Android SDK environment variables (`ANDROID_HOME`) are added to your shell profile (`.zshrc` or `.bash_profile`).

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/iintore/Design-hackathon.git
   cd Design-hackathon
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   > [!NOTE]
   > The `npm install` command will automatically run a post-install patch (`node scripts/apply-patches.js`). This patch configures the Expo CLI to target the **iPhone 16 Pro** simulator by default when booting the iOS simulator.

---

## 🏃 Running the Prototype

1. **Start the Expo Development Server**
   ```bash
   npm run start
   ```
   *This starts the Expo Metro Bundler and outputs a QR code in the terminal.*

2. **Launch the App**
   * **iOS Simulator**: Press `i` in the terminal (or run `npm run ios`).
   * **Android Emulator**: Press `a` in the terminal (or run `npm run android`).
   * **Physical Device**: Open the Camera app (iOS) or the Expo Go app (Android) and scan the QR code displayed in the terminal.
   * **Web Browser**: Press `w` in the terminal (or run `npm run web`).

3. **Clear Cache (If Needed)**
   If you experience issues with caching or code updates not reflecting, restart the server with:
   ```bash
   npx expo start -c
   ```

---

## 🎨 Prototype Features

This prototype demonstrates a complete guardian workflow:
* **Onboarding & Authentication**: Welcome page selecting country, logging in with a `SchoolID` credentials simulation.
* **Guardian Dashboard (Home)**: View current statuses of children (e.g. *In School*, *Day Off*, *Absence Reported*) and school events.
* **Quick Action Sheets**:
  * **Submit Schedule**: Register arrival and pickup times for children.
  * **Report Absence**: Notify the school about sick leave, medical appointments, or personal leave.
  * **Send Message**: Send direct updates to class teachers.
* **History Log**: Track past messages and status records chronologically.
* **Account Settings**: Explore additional settings under the **More** tab.

---

## 📁 Project Structure

* `/src/app/` - File-based routing navigation screens (Expo Router).
  * `/src/app/onboarding/` - Welcome and child verification screens.
  * `/src/app/(tabs)/` - Tab navigation pages (`home`, `schedule`, `history`, `messages`, `more`).
  * `/src/app/flows/` - Submission flows (Reporting absence, submitting schedules).
* `/src/components/` - Shared UI elements, buttons, and custom layout sheets.
* `/src/context/` - Global application state providers.
* `/scripts/` - Postinstall and automation scripts.
