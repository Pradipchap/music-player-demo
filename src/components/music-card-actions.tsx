import { ITrack } from "@/audio/audio.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TrackActionsProps extends Partial<ITrack> {
  onPlay: () => void;
  onPlayNext: () => void;
  onAddToQueue: () => void;
}

export const MusicActionsCard: React.FC<TrackActionsProps> = ({ onPlay, onPlayNext, onAddToQueue, title = "", artist = "" }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleActionPress = (action: "play" | "playNext" | "addToQueue", callback: () => void) => {
    setSelectedAction(action);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
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

    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();

    callback();

    setTimeout(() => setSelectedAction(null), 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {artist}
        </Text>
      </View>

      <Animated.View style={[styles.actionsContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3]
              })
            }
          ]}
        />

        <TouchableOpacity
          onPress={() => handleActionPress("play", onPlay)}
          style={[styles.actionButton, styles.primaryAction, selectedAction === "play" && styles.selectedAction]}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["#1DB954", "#1ED760"]}
                style={styles.primaryIconBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={24} color="white" />
              </LinearGradient>
              {selectedAction === "play" && <Animated.View style={[styles.successRing]} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.primaryActionText}>Play Now</Text>
              <Text style={styles.actionDescription}>Start playing immediately</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => handleActionPress("playNext", onPlayNext)}
          style={[styles.actionButton, selectedAction === "playNext" && styles.selectedAction]}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <View style={[styles.iconContainer, styles.secondaryIconContainer]}>
              <View style={styles.secondaryIconBackground}>
                <Ionicons name="play-skip-forward" size={22} color="#1DB954" />
              </View>
              {selectedAction === "playNext" && <Animated.View style={[styles.successRing, styles.secondaryRing]} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionText}>Play Next</Text>
              <Text style={styles.actionDescription}>Add to play next</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => handleActionPress("addToQueue", onAddToQueue)}
          style={[styles.actionButton, selectedAction === "addToQueue" && styles.selectedAction]}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <View style={[styles.iconContainer, styles.secondaryIconContainer]}>
              <View style={styles.secondaryIconBackground}>
                <Ionicons name="list" size={22} color="#1DB954" />
              </View>
              {selectedAction === "addToQueue" && <Animated.View style={[styles.successRing, styles.secondaryRing]} />}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionText}>Add to Queue</Text>
              <Text style={styles.actionDescription}>Add to end of queue</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      {selectedAction && (
        <Animated.View
          style={[
            styles.successMessage,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ],
              opacity: slideAnim
            }
          ]}
        >
          <LinearGradient colors={["rgba(29, 185, 84, 0.15)", "rgba(29, 185, 84, 0.1)"]} style={styles.successGradient}>
            <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
            <Text style={styles.successText}>
              {selectedAction === "play" && "Playing now!"}
              {selectedAction === "playNext" && "Added to play next!"}
              {selectedAction === "addToQueue" && "Added to queue!"}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 32,
    alignSelf: "center",
    marginVertical: 16
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    overflow: "hidden"
  },

  gradientHeader: {
    ...StyleSheet.absoluteFillObject
  },

  trackTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.3,
    marginBottom: 4
  },

  artistName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500"
  },

  actionsContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: -10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    position: "relative",
    overflow: "hidden",
    zIndex: 2
  },

  actionsBackground: {
    ...StyleSheet.absoluteFillObject
  },

  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1DB954",
    borderRadius: 20
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "transparent"
  },

  primaryAction: {
    backgroundColor: "rgba(29, 185, 84, 0.03)"
  },

  selectedAction: {
    backgroundColor: "rgba(29, 185, 84, 0.08)"
  },

  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },

  iconContainer: {
    position: "relative",
    marginRight: 16
  },

  primaryIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },

  secondaryIconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },

  secondaryIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(29, 185, 84, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },

  successRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#1DB954"
  },

  secondaryRing: {
    borderColor: "rgba(29, 185, 84, 0.5)"
  },

  textContainer: {
    flex: 1
  },

  primaryActionText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2
  },

  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2
  },

  actionDescription: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500"
  },

  chevronContainer: {
    marginLeft: 12
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginHorizontal: 20
  },

  successMessage: {
    position: "absolute",
    bottom: -60,
    left: 0,
    right: 0,
    zIndex: 1
  },

  successGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10
  },

  successText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1DB954",
    flex: 1
  }
});
