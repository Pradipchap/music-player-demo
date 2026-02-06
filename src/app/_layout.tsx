import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { BottomSheet } from "@/components/bottom-sheet";
import { MiniPlayer } from "@/components/floating-mini-player";
import { isIOS } from "@/constants/misc";
import { useHandleQueue } from "@/hooks/use-handle-queue";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useHandleQueue();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
      {!isIOS ? <MiniPlayer /> : null} <BottomSheet />
    </ThemeProvider>
  );
}
