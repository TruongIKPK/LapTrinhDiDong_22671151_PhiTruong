import React from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NotesProvider } from "./NotesContext";

export default function RootLayout() {
  return (
    <NotesProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Slot />
      </SafeAreaProvider>
    </NotesProvider>
  );
}
