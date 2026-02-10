import { ITrack } from "@/audio/audio.types";
import { MusicCard } from "@/components/cards/MusicCards/MusicCardHorizontal";
import CustomIcon from "@/components/Icon";
import { MusicActionsCard } from "@/components/music-card-actions";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { pinkFloydTracks } from "@/services/audioLibrary";
import { useGetCurrentTrack, useGetIsPlaying, useSetRepeatMode } from "@/store/audioStore";
import { useBottomPlayerSheetStore } from "@/store/player-bottom-sheet-store";
import { useInsertLast, useInsertNext, useSetQueue } from "@/store/queue-store";
import { REPEAT_MODE } from "@/types";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { setShowPlayerSheet } = useBottomPlayerSheetStore();
  const { playTrack } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();
  const add = useSetQueue();
  const setRepeatMode = useSetRepeatMode();
  const insertNext = useInsertNext();
  const insertLast = useInsertLast();

  const addAllToQueue = () => {
    setRepeatMode(REPEAT_MODE.QUEUE_LOOP);
    add(pinkFloydTracks);
  };

  const onActionPress = (data: ITrack) => {
    setShowPlayerSheet({
      isPlayerVisible: true,
      children: (
        <MusicActionsCard
          {...data}
          onAddToQueue={() => {
            insertLast(data);
            setShowPlayerSheet({ isPlayerVisible: false, children: null });
          }}
          onPlay={() => {
            playTrack(data);
            setShowPlayerSheet({ isPlayerVisible: false, children: null });
          }}
          onPlayNext={() => {
            insertNext(data);
            setShowPlayerSheet({ isPlayerVisible: false, children: null });
          }}
        />
      )
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "top"]}>
        <TouchableOpacity onPress={addAllToQueue} style={styles.addAllToQueue}>
          <CustomIcon name="Plus" color={"white"} size={18} />
          <ThemedText style={{ color: "white" }}>Add all to Queue</ThemedText>
        </TouchableOpacity>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pinkFloydTracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MusicCard
              isPlaying={isPlaying && currentTrack?.id === item.id}
              onPress={() => playTrack(item)}
              onActionPress={() => onActionPress(item)}
              {...item}
            />
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
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingHorizontal: 5
  },
  addAllToQueue: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 50,
    marginLeft: "auto"
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
