import { Stack } from "expo-router";
import { useEffect } from "react";
import { openDB } from "./db";

export default function Layout() {
  useEffect(() => {
    (async () => {
      try {
        await openDB();
        console.log("Database opened and initialized successfully");
      } catch (error) {
        console.error("Error opening DB:", error);
      }
    })();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}