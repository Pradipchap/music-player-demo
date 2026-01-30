import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { MiniPlayer } from "@/components/floating-mini-player";
import { useHandleQueue } from "@/hooks/use-handle-queue";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useHandleQueue();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
      <MiniPlayer />
    </ThemeProvider>
  );
}
