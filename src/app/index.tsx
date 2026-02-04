import { MusicCard } from "@/components/cards/MusicCards/MusicCardHorizontal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useGetTracks } from "@/services/use-get-tracks";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import { useSetQueue } from "@/store/queue-store";
import { STATUS } from "@/types";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { playTrack } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();
  const { tracks, status } = useGetTracks();
  const add = useSetQueue();

  const addAllToQueue = () => {
    add(tracks);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MusicCard isPlaying={isPlaying && currentTrack?.id === item.id} onPress={() => playTrack(item)} {...item} />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <TouchableOpacity onPress={addAllToQueue}>
                <ThemedText style={styles.lightText}>Add All To Queue</ThemedText>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={status === STATUS.PENDING ? <ActivityIndicator /> : undefined}
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
  listHeader: {
    padding: 10,
    margin: 10,
    backgroundColor: "green",
    marginLeft: "auto",
    borderRadius: 20
  },
  lightText: {
    color: "#ffff"
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
