import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useSeekMusic } from "@/hooks/use-seek-music";
import { useGetCurrentTrack, useGetIsPlaying } from "@/store/audioStore";
import { useBottomPlayerSheetStore } from "@/store/player-bottom-sheet-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image, ImageSourcePropType, Platform, Pressable, StyleSheet, View } from "react-native";
import { BottomSheetPlayer } from "./bottom-sheet-player";
import CustomIcon from "./Icon";
import { ThemedText } from "./themed-text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const MiniPlayer = () => {
  const { setShowPlayerSheet } = useBottomPlayerSheetStore();
  const currentTrack = useGetCurrentTrack();
  const { togglePlayPause, handleNext, handlePrev } = useAudioPlayer();
  const isPlaying = useGetIsPlaying();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true
    }).start();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
      pulseAnim.setValue(1);
      Animated.timing(rotateAnim, { toValue: 4, useNativeDriver: true }).stop();
      Animated.timing(pulseAnim, { toValue: 4, useNativeDriver: true }).stop();
    }
  }, [isPlaying]);

  const onMiniPlayerPress = () => {
    setShowPlayerSheet({ isPlayerVisible: true, children: <BottomSheetPlayer /> });
  };

  const handlePlayPause = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    togglePlayPause();
  };

  const handleNavPress = (direction: "prev" | "next") => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    if (direction === "prev") handlePrev();
    else handleNext();
  };

  if (!currentTrack) return null;
  const { thumbnail, title, artist } = currentTrack;

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  return (
    <Animated.View
      style={[
        styles.shadowContainer,
        {
          transform: [{ translateY: slideInterpolate }],
          opacity: slideAnim
        }
      ]}
    >
      <Pressable onPress={onMiniPlayerPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 240, 0.95)"]}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.albumContainer}>
          <Animated.View style={[styles.albumWrapper, { transform: [{ rotate: rotateInterpolate }] }]}>
            <Image source={thumbnail as ImageSourcePropType} style={styles.thumbnail} resizeMode="cover" />
          </Animated.View>

          <View style={styles.vinylRing} />
          <View style={styles.vinylRing2} />

          {isPlaying && (
            <View style={styles.playingIndicator}>
              <View style={styles.pulseDot} />
              <View style={styles.pulseRing} />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.textWrapper}>
            <ThemedText numberOfLines={1} style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText numberOfLines={1} style={styles.artist}>
              {artist}
            </ThemedText>
          </View>
          <ProgressFill />
        </View>

        <Animated.View style={[styles.controls, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable
            onPress={() => handleNavPress("prev")}
            style={({ pressed }) => [styles.controlButton, pressed && styles.buttonPressed]}
            hitSlop={10}
          >
            <CustomIcon name="Prev" size={24} color="#1a1a1a" />
          </Pressable>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [styles.playButton, isPlaying && styles.pauseButton, pressed && styles.buttonPressed]}
              hitSlop={10}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={isPlaying ? 20 : 22} color="white" />
            </Pressable>
          </Animated.View>

          <Pressable
            onPress={() => handleNavPress("next")}
            style={({ pressed }) => [styles.controlButton, pressed && styles.buttonPressed]}
            hitSlop={10}
          >
            <CustomIcon name="Next" size={24} color="#1a1a1a" />
          </Pressable>
        </Animated.View>
        <View style={styles.expandIndicator}>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const ProgressFill = () => {
  const { currentTime, duration } = useSeekMusic();
  const widthInPercentage = Math.ceil((currentTime * 100) / duration);
  return (
    <>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: `${widthInPercentage}%` }]} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 90,
    alignSelf: "center",
    width: SCREEN_WIDTH - 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10
  },

  container: {
    width: "100%",
    height: 72,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: "hidden",
    position: "relative"
  },

  background: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20
  },

  pressed: {
    backgroundColor: "rgba(29, 185, 84, 0.05)"
  },

  albumContainer: {
    position: "relative",
    marginRight: 12
  },

  albumWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },

  thumbnail: {
    width: "100%",
    height: "100%"
  },

  vinylRing: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)"
  },

  vinylRing2: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.1)"
  },

  playingIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center"
  },

  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1DB954",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2
  },

  pulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(29, 185, 84, 0.3)"
  },

  textContainer: {
    flex: 1,
    marginRight: 12
  },

  textWrapper: {
    marginBottom: 6
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 2
  },

  artist: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: "500"
  },

  progressContainer: {
    marginTop: 4
  },

  progressBar: {
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 1,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 1
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },

  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center"
  },

  buttonPressed: {
    backgroundColor: "rgba(29, 185, 84, 0.1)"
  },

  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },

  pauseButton: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30"
  },

  expandIndicator: {
    position: "absolute",
    bottom: 8,
    right: 16
  },

  dots: {
    flexDirection: "row",
    gap: 2
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },

  dot1: {
    opacity: 0.6
  },

  dot2: {
    opacity: 0.4
  },

  dot3: {
    opacity: 0.2
  }
});
