# Round Timer

> A clean, minimalist round timer app built with React Native and Expo. Perfect for workouts, HIIT, boxing, and interval training.

## ✨ Features

- ⏱️ **Customizable Intervals** - Set your own round and break durations
- 🔔 **Smart Alerts** - Audio and haptic feedback (3 short beeps + 1 long beep) 4 seconds before each phase ends
- 💾 **Persistent Settings** - Your preferences are saved locally and restored on app launch
- ⏯️ **Full Playback Control** - Play, pause, resume, and reset with intuitive controls
- 🎨 **Beautiful UI** - Modern, clean interface with smooth animations
- 📱 **Cross-Platform** - Works on both iOS and Android

## 🏃 Perfect For

- HIIT workouts
- Boxing and martial arts training
- Tabata intervals
- Circuit training
- Any round-based exercise routine

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/client) app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jwschwaner/round-timer.git
cd round-timer
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with:
   - **iOS**: Camera app (opens in Expo Go)
   - **Android**: Expo Go app

## 📱 Usage

1. **Start Timer**: Tap the large play button to begin your first round
2. **Pause/Resume**: Tap pause during a session, then tap play to continue
3. **Reset**: Use the reset button to return to the initial state
4. **Configure Settings**: 
   - Tap the gear icon in the top-right
   - Adjust round length, break length, and number of rounds
   - Changes are saved automatically

## 🎨 Default Settings

- **Round Duration**: 3 minutes
- **Break Duration**: 1 minute
- **Total Rounds**: 5

## 🏗️ Project Structure

```
round-timer/
├── App.tsx                 # Main application component
├── components/
│   ├── SettingsModal.tsx   # Settings modal with keyboard handling
│   └── TimePicker.tsx      # Inline time picker component
├── constants/
│   ├── colors.ts           # Design system colors
│   └── strings.ts          # Localization-ready strings
├── hooks/
│   └── useTimer.ts         # Timer state management and logic
└── utils/
    ├── audio.ts            # Audio/haptic feedback
    └── storage.ts          # AsyncStorage persistence
```

## 🛠️ Built With

- **[React Native](https://reactnative.dev/)** - Mobile framework
- **[Expo](https://expo.dev/)** - Development platform
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Gluestack UI](https://gluestack.io/)** - Component library
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local data persistence
- **[Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)** - Audio playback
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** - Haptic feedback
- **[react-native-timer-picker](https://github.com/troberts-28/react-native-timer-picker)** - Time selection UI

## 🎯 Roadmap

- [ ] Add sound customization options
- [ ] Support for custom workout templates
- [ ] Background timer support
- [ ] Apple Watch companion app
- [ ] Workout history and statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**jwschwaner**
- GitHub: [@jwschwaner](https://github.com/jwschwaner)

---

⭐ Star this repo if you find it helpful!
