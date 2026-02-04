import { MusicCard } from "@/components/cards/MusicCards/MusicCardHorizontal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { pinkFloydTracks } from "@/services/audioLibrary";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import { useSetQueue } from "@/store/queue-store";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { playTrack } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();
  const add = useSetQueue();

  const addAllToQueue = () => {
    add(pinkFloydTracks.slice(1, 4));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={addAllToQueue}>
          <ThemedText>add all to queue</ThemedText>
        </TouchableOpacity>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pinkFloydTracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MusicCard isPlaying={isPlaying && currentTrack?.id === item.id} onPress={() => playTrack(item)} {...item} />
          )}
          style={{ width: "100%" }}
        />
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
