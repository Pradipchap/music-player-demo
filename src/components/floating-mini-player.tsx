import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import { useBottomPlayerSheetStore } from "@/store/player-bottom-sheet-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

export const MiniPlayer = () => {
  const { setShowPlayerSheet } = useBottomPlayerSheetStore();
  const currentTrack = useGetCurrentTrack();
  const { togglePlayPause } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  const onMiniPlayerPress = () => {
    setShowPlayerSheet(true);
  };
  const onNext = () => {};
  if (!currentTrack) return null;
  const { thumbnail, title, artist } = currentTrack;

  return (
    <Pressable style={styles.container} onPress={onMiniPlayerPress}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />

      <View style={styles.textContainer}>
        <ThemedText numberOfLines={1} style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText numberOfLines={1} style={styles.artist}>
          {artist}
        </ThemedText>
      </View>

      <View style={styles.controls}>
        <Pressable hitSlop={10} onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={28} />
        </Pressable>

        {onNext && (
          <Pressable onPress={onNext} hitSlop={10}>
            <Ionicons name="play-skip-forward" size={24} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#e9e6e6",
    height: 68,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 6
  },
  textContainer: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    fontSize: 14,
    fontWeight: "600"
  },
  artist: {
    color: "#403e3e",
    fontSize: 12,
    marginTop: 2
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  }
});
