import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import Slider from "@react-native-community/slider";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomIcon from "./Icon";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

export const BottomSheetPlayer = () => {
  const currentTrack = useGetCurrentTrack();
  const { togglePlayPause, handleNext, handlePrev, handleShuffle } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  if (!currentTrack) return;
  const { title, artist } = currentTrack;

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
        <TouchableOpacity onPress={handlePrev} style={styles.mute}>
          <CustomIcon name="UnMute" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrev}>
          <CustomIcon name="Prev" size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <CustomIcon name={isPlaying ? "Pause" : "Play"} size={35} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <CustomIcon name="Next" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShuffle} style={styles.shuffle}>
          <CustomIcon name="Shuffle" size={30} />
        </TouchableOpacity>
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
  shuffle: {
    marginLeft: "auto"
  },
  mute: {
    marginRight: "auto"
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
