import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View } from "react-native";
import Animated, {
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlayToggle from "./PlayToggle";
import Button from "./ui/Button";

interface HomeControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

// Custom entering animation: grow from center outward
const growFromCenter = (side: "left" | "right") => {
  "worklet";
  return () => {
    "worklet";
    const animations = {
      opacity: withTiming(1, { duration: 400 }),
      transform: [
        {
          translateX: withSpring(0, {
            damping: 60,
          }),
        },
      ],
    };
    const initialValues = {
      opacity: 0,
      transform: [{ translateX: side === "left" ? 16 : -16 }],
    };
    return {
      initialValues,
      animations,
    };
  };
};

// Custom exiting animation: shrink back to center
const shrinkToCenter = (side: "left" | "right") => {
  "worklet";
  return () => {
    "worklet";
    const animations = {
      opacity: withTiming(0, { duration: 300 }),
      transform: [
        {
          translateX: withTiming(side === "left" ? 16 : -16, {
            duration: 300,
          }),
        },
      ],
    };
    const initialValues = {
      opacity: 1,
      transform: [{ translateX: 0 }],
    };
    return {
      initialValues,
      animations,
    };
  };
};

export default function HomeControls({
  isPlaying,
  onPlayToggle,
}: HomeControlsProps) {
  const safeArea = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: safeArea.bottom,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Left Button - Link to Sounds (hidden when playing) */}
      {!isPlaying && (
        <Animated.View
          entering={growFromCenter("left")}
          exiting={shrinkToCenter("left")}
        >
          <Link href="/sounds" asChild>
            <Button>
              <View
                style={{
                  height: "100%",
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="grid-outline" size={20} color="white" />
              </View>
            </Button>
          </Link>
        </Animated.View>
      )}

      {/* Middle Button - Play Toggle (always visible) */}
      <PlayToggle isPlaying={isPlaying} onPress={onPlayToggle} />

      {/* Right Button - Random Icon (hidden when playing) */}
      {!isPlaying && (
        <Animated.View
          entering={growFromCenter("right")}
          exiting={shrinkToCenter("right")}
        >
          <Button onPress={() => console.log("Right button pressed")}>
            <View
              style={{
                height: "100%",
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="settings-outline" size={20} color="white" />
            </View>
          </Button>
        </Animated.View>
      )}
    </View>
  );
}

