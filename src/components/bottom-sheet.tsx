import { useBottomPlayerSheetStore } from "@/store/player-bottom-sheet-store";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { ThemedView } from "./themed-view";

export function BottomSheet() {
  const duration = 500;
  const { isPlayerVisible, setShowPlayerSheet, children } = useBottomPlayerSheetStore();
  const height = useSharedValue(0);
  const progress = useDerivedValue(() => withTiming(isPlayerVisible ? 0 : 1, { duration }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }]
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isPlayerVisible ? 1 : withDelay(duration, withTiming(-1, { duration: 0 }))
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity
          style={styles.flex}
          onPress={() => {
            setShowPlayerSheet({ isPlayerVisible: false, children: null });
          }}
        />
      </Animated.View>
      <Animated.View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle]}
      >
        <ThemedView style={{ height: "100%", width: "100%", borderRadius: 10, paddingVertical: 10 }}>{children}</ThemedView>
      </Animated.View>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    // height: 150,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  }
});

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    height: 250
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around"
  },
  toggleButton: {
    backgroundColor: "#b58df1",
    padding: 12,
    borderRadius: 48
  },
  toggleButtonText: {
    color: "white"
  },
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2
  },
  bottomSheetButtonText: {
    fontWeight: 600,
    textDecorationLine: "underline"
  }
});
