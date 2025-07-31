# 🚀 Animated FAB Menu for React Native

A beautiful, smooth, and responsive **Floating Action Button** (FAB) that expands into a fully animated **menu overlay** — complete with glassy blur backdrop and springy item transitions. Built with **Reanimated 3** and **expo-blur** 💫

https://github.com/user-attachments/assets/c466d0b0-a87f-4e82-a9e0-f419c9e41ecb

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
