import { ITrack } from "@/audio/audio.types";
import CustomIcon from "@/components/Icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import React from "react";
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";

interface MusicCardProps extends ITrack {
  isPlaying?: boolean;
  onPress?: () => void;
  index?: number;
}

export const MusicCard: React.FC<MusicCardProps> = ({ title, artist, thumbnail, isPlaying = false, onPress, index = 0 }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 150,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

  React.useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, { useNativeDriver: true, toValue: 4 }).stop();
    }
  }, [isPlaying]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <Animated.View
      style={[
        styles.shadowContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: index * 0.03 + 0.94
        }
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      >
        <ThemedView style={styles.imageWrapper}>
          <Animated.View style={[styles.imageContainer, isPlaying && { transform: [{ rotate: rotateInterpolate }] }]}>
            <Image source={thumbnail as ImageSourcePropType} style={styles.rotatingImage} />
          </Animated.View>

          {isPlaying && (
            <View style={styles.playingIndicator}>
              <View style={styles.pulsingDot} />
            </View>
          )}

          <View style={styles.imageOverlay} />
        </ThemedView>

        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <ThemedText numberOfLines={1} style={[styles.title, isPlaying && styles.playingTitle]}>
              {title}
            </ThemedText>

            {artist && (
              <ThemedText numberOfLines={1} style={styles.artist}>
                {artist}
              </ThemedText>
            )}
          </View>
        </View>

        <Animated.View style={[styles.actionButton, isPlaying && styles.playingButton]}>
          <CustomIcon name={isPlaying ? "Pause" : "Play"} size={20} color={"white"} />

          {isPlaying && (
            <View style={styles.rippleEffect}>
              <View style={styles.rippleCircle} />
            </View>
          )}
        </Animated.View>

        <View style={styles.gradientOverlay} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "transparent"
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    overflow: "hidden",
    minHeight: 88
  },

  pressed: {
    backgroundColor: "rgba(29, 185, 84, 0.05)"
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center"
  },

  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative"
  },

  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 12
  },

  rotatingImage: {
    width: "100%",
    height: "100%"
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12
  },

  playingIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center"
  },

  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1DB954",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4
  },

  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center"
  },

  textContainer: {
    flex: 1,
    justifyContent: "center"
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 4,
    color: "#1a1a1a"
  },

  playingTitle: {
    color: "#1DB954",
    fontWeight: "800"
  },

  artist: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    letterSpacing: -0.2
  },

  progressContainer: {
    marginTop: 8
  },

  progressBar: {
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 1,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    width: "30%",
    backgroundColor: "#1DB954",
    borderRadius: 1
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },

  playingButton: {
    backgroundColor: "#FF3B30"
  },

  rippleEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },

  rippleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255, 59, 48, 0.3)"
  },

  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    pointerEvents: "none"
  }
});
