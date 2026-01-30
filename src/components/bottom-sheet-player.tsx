import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import Slider from "@react-native-community/slider";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import CustomIcon from "./Icon";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

export const BottomSheetPlayer = () => {
  const currentTrack = useGetCurrentTrack();
  const { togglePlayPause, handleNext, handlePrev } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  if (!currentTrack) return;
  const { thumbnail, title, artist } = currentTrack;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.meta}>
        <ThemedView style={styles.thumbnailContainer}></ThemedView>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        <ThemedText style={styles.artist} numberOfLines={1}>
          {artist}
        </ThemedText>
      </View>

      <Slider
        value={0}
        minimumValue={0}
        maximumValue={120}
        onSlidingComplete={() => {}}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#999"
        thumbTintColor="#1DB954"
      />

      <View style={styles.timeRow}>
        <ThemedText style={styles.time}>{formatTime(1)}</ThemedText>
        <ThemedText style={styles.time}>{formatTime(120)}</ThemedText>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={handlePrev}>
          <CustomIcon name="Prev" size={28} />
        </Pressable>

        <Pressable style={styles.playButton} onPress={togglePlayPause}>
          <CustomIcon name={isPlaying ? "Pause" : "Play"} size={32} color="white" />
        </Pressable>

        <Pressable onPress={handleNext}>
          <CustomIcon name="Next" size={28} />
        </Pressable>
      </View>

      <View style={styles.volumeRow}>
        <CustomIcon name="volume-1" size={20} />
        <Slider
          style={{ flex: 1 }}
          value={0.2}
          minimumValue={0}
          maximumValue={1}
          onValueChange={() => {}}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#999"
          thumbTintColor="#1DB954"
        />
        <CustomIcon name="volume-2" size={20} />
      </View>
    </ThemedView>
  );
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%"
  },
  meta: {
    alignItems: "center",
    marginBottom: 12,
    gap: 10
  },
  thumbnailContainer: {
    height: SCREEN_HEIGHT * 0.3,
    width: "100%",
    backgroundColor: "gray",
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "600"
  },
  artist: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 2
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  time: {
    fontSize: 12,
    opacity: 0.6
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginVertical: 16
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center"
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  }
});
