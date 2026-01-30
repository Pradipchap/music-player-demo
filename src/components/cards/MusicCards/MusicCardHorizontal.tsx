import { ITrack } from "@/audio/audio.types";
import CustomIcon from "@/components/Icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface MusicCardProps extends ITrack {
  isPlaying?: boolean;
  onPress?: () => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({ title, artist, thumbnail, isPlaying = false, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && { opacity: 0.85 }]}>
      <ThemedView style={styles.imageWrapper}>
        <Image source={{ uri: thumbnail }} style={styles.image} />
      </ThemedView>

      <ThemedView style={styles.info}>
        <ThemedText numberOfLines={1} style={[styles.title, isPlaying && styles.playing]}>
          {title}
        </ThemedText>

        {artist && (
          <ThemedText numberOfLines={1} style={styles.artist}>
            {artist}
          </ThemedText>
        )}
      </ThemedView>

      <View style={styles.playButton}>
        <CustomIcon name={isPlaying ? "Pause" : "Play"} size={18} color={"white"} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    width: "100%"
  },

  imageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#222"
  },

  image: {
    width: "100%",
    height: "100%"
  },

  info: {
    flex: 1,
    marginLeft: 12
  },

  title: {
    fontSize: 15,
    fontWeight: "600"
  },

  playing: {
    color: "#128b3c"
  },

  artist: {
    marginTop: 2,
    color: "#5e5e5e",
    fontSize: 12
  },

  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  }
});
