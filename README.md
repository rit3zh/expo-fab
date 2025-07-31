# 🚀 Animated FAB Menu for React Native

A beautiful, smooth, and responsive **Floating Action Button** (FAB) that expands into a fully animated **menu overlay** — complete with glassy blur backdrop and springy item transitions. Built with **Reanimated 3** and **expo-blur** 💫

## ✨ Features

- 🔘 Floating button with smooth **expand/contract animations**
- 🌫️ **Blurred backdrop** using `expo-blur` + animated opacity
- 🌀 Menu items appear with **staggered spring animations**
- 📱 Fully responsive and **customizable**

## 📦 Dependencies

```bash
pnpm install react-native-reanimated expo-blur @expo/vector-icons
```

> Make sure Reanimated is properly configured in your project (`babel.config.js`, `react-native-reanimated/plugin`, etc.)

## 🧩 Usage

```tsx
import FloatingActionButton from "./FloatingActionButton"; // path to your component

export default function App() {
  return (
    <>
      {/* Your app content */}
      <FloatingActionButton />
    </>
  );
}
```
