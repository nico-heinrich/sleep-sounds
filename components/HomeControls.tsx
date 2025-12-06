import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Button from "./ui/Button";
import PlayToggle from "./PlayToggle";
import { Ionicons } from "@expo/vector-icons";

interface HomeControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

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
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
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
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
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

