import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { audioManager } from "@/audio/audioManager";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { demoPlaylist } from "@/services/audioLibrary";

export default function HomeScreen() {
  const playAudio = async () => {
    audioManager.loadAudio({ id: demoPlaylist[0].id, audioUrl: demoPlaylist[1].url }).then(() => {
      audioManager.play();
    });
  };
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText>Hello</ThemedText>
        <TouchableOpacity onPress={playAudio}>
          <ThemedText>Play</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => audioManager.volumeUp()}>
          <ThemedText>Volume Up</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => audioManager.volumeDown()}>
          <ThemedText>Volume Up</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            audioManager.togglePlay();
          }}
        >
          <ThemedText>Toggle</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four
  },
  title: {
    textAlign: "center"
  },
  code: {
    textTransform: "uppercase"
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four
  }
});
