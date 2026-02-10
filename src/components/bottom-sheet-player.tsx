import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useHandleRepeatMode } from "@/hooks/use-handle-repeat-mode";
import { useSeekMusic } from "@/hooks/use-seek-music";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import { REPEAT_MODE } from "@/types";
import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Easing, ImageSourcePropType, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomIcon from "./Icon";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BottomSheetPlayer = () => {
  const currentTrack = useGetCurrentTrack();
  const { togglePlayPause, handleNext, handlePrev, handleShuffle } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();
  const isShuffling = true;
  const [imageScale] = useState(new Animated.Value(1));

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinValue.setValue(0);
      Animated.timing(spinValue, { toValue: 4, useNativeDriver: true }).stop();
    }
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const handlePlayPulse = () => {
    Animated.sequence([
      Animated.timing(imageScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    togglePlayPause();
  };

  if (!currentTrack) return null;
  const { title, artist, thumbnail } = currentTrack;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.albumContainer}>
        <Animated.View style={[styles.albumWrapper, { transform: [{ rotate: spin }] }]}>
          <Animated.Image
            source={thumbnail as ImageSourcePropType}
            style={[styles.albumArt, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
          />
          <View style={styles.albumOverlay} />
        </Animated.View>

        <View style={styles.vinylRing} />
        <View style={styles.vinylRing2} />

        {isPlaying && (
          <View style={styles.playingIndicator}>
            <View style={styles.pulseCircle} />
            <View style={styles.pulseCircle2} />
          </View>
        )}
      </View>

      <View style={styles.trackInfo}>
        <View style={styles.textWrapper}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          <ThemedText style={styles.artist} numberOfLines={1}>
            {artist}
          </ThemedText>
        </View>
      </View>

      <Seeker />

      <View style={styles.mainControls}>
        <TouchableOpacity onPress={handleShuffle} style={styles.controlButton}>
          <CustomIcon name="Shuffle" size={24} color={isShuffling ? "#1DB954" : "#666"} />
          {isShuffling && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrev} style={[styles.controlButton, styles.navButton]}>
          <CustomIcon name="Prev" size={28} color="#1a1a1a" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPulse} style={styles.playPauseButton}>
          <View style={styles.playButtonGlow}>
            <CustomIcon name={isPlaying ? "Pause" : "Play"} size={32} color="white" />
          </View>
          {isPlaying && <View style={styles.pulseRing} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={[styles.controlButton, styles.navButton]}>
          <CustomIcon name="Next" size={28} color="#1a1a1a" />
        </TouchableOpacity>

        <RepeatModeToggler />
      </View>
    </ThemedView>
  );
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function Seeker() {
  const { duration, currentTime, onSeek } = useSeekMusic();
  const [sliding, setSliding] = useState(false);
  const [slideValue, setSlideValue] = useState(currentTime);

  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <View style={styles.seekerContainer}>
      <View style={styles.timeLabels}>
        <ThemedText style={styles.time}>{formatTime(currentTime)}</ThemedText>
        <ThemedText style={styles.time}>{formatTime(duration)}</ThemedText>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>

        <Slider
          style={styles.slider}
          value={sliding ? slideValue : currentTime}
          minimumValue={0}
          maximumValue={duration}
          onValueChange={value => {
            setSliding(true);
            setSlideValue(value);
          }}
          onSlidingComplete={value => {
            setSliding(false);
            onSeek(value);
          }}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#1DB954"
        />
      </View>

      <View style={styles.progressDots}>
        {[0, 25, 50, 75, 100].map(percent => (
          <View key={percent} style={[styles.progressDot, progressPercentage >= percent && styles.progressDotActive]} />
        ))}
      </View>
    </View>
  );
}

function RepeatModeToggler() {
  const { repeatMode, handleToggleRepeatMode } = useHandleRepeatMode();

  return (
    <TouchableOpacity style={styles.controlButton} onPress={handleToggleRepeatMode}>
      <CustomIcon name="Repeat" size={24} color={repeatMode === REPEAT_MODE.TRACK_LOOP ? "#666" : "#1DB954"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },

  albumContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative"
  },

  albumWrapper: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: SCREEN_WIDTH * 0.25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10
  },

  albumArt: {
    width: "100%",
    height: "100%"
  },

  albumOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  },

  vinylRing: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.52,
    height: SCREEN_WIDTH * 0.52,
    borderRadius: SCREEN_WIDTH * 0.26,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)"
  },

  vinylRing2: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.54,
    height: SCREEN_WIDTH * 0.54,
    borderRadius: SCREEN_WIDTH * 0.27,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)"
  },

  playingIndicator: {
    position: "absolute",
    bottom: 20,
    right: "30%",
    alignItems: "center",
    justifyContent: "center"
  },

  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DB954",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4
  },

  pulseCircle2: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(29, 185, 84, 0.3)"
  },

  trackInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24
  },

  textWrapper: {
    flex: 1,
    marginRight: 12
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5
  },

  artist: {
    fontSize: 16,
    opacity: 0.7,
    fontWeight: "500"
  },

  loveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },

  seekerContainer: {
    marginBottom: 32
  },

  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },

  time: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8
  },

  progressBarContainer: {
    position: "relative",
    height: 24,
    justifyContent: "center"
  },

  progressBackground: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 2
  },

  slider: {
    ...StyleSheet.absoluteFill,
    height: 24
  },

  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },

  progressDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e0e0e0"
  },

  progressDotActive: {
    backgroundColor: "#1DB954"
  },

  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    paddingHorizontal: 12
  },

  controlButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },

  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 22
  },

  activeDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1DB954"
  },

  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },

  playButtonGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2
  },

  pulseRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "rgba(29, 185, 84, 0.3)",
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-out"
  },

  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8
  },

  volumeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },

  volumeSlider: {
    flex: 1,
    height: 24
  },

  volumeThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  }
});
