import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View } from "react-native";
import Animated, { withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSound } from "../contexts/SoundContext";
import PlayToggle from "./PlayToggle";
import Button from "./ui/Button";
import SoundsIcon from "./icons/SoundsIcon";
import InfinityIcon from "./icons/InfinityIcon";

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
  const { shouldAnimateHome } = useSound();

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
          entering={shouldAnimateHome ? growFromCenter("left") : undefined}
          exiting={shouldAnimateHome ? shrinkToCenter("left") : undefined}
        >
          <Link href="/sounds" asChild>
            <Button square>
              <SoundsIcon />
            </Button>
          </Link>
        </Animated.View>
      )}

      {/* Middle Button - Play Toggle (always visible) */}
      <PlayToggle isPlaying={isPlaying} onPress={onPlayToggle} />

      {/* Right Button - Random Icon (hidden when playing) */}
      {!isPlaying && (
        <Animated.View
          entering={shouldAnimateHome ? growFromCenter("right") : undefined}
          exiting={shouldAnimateHome ? shrinkToCenter("right") : undefined}
        >
          <Button square onPress={() => console.log("Right button pressed")}>
            <InfinityIcon />
          </Button>
        </Animated.View>
      )}
    </View>
  );
}
