import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeControls from "../components/HomeControls";
import { useSound } from "../contexts/SoundContext";
import { sets } from "../data/sets";

export default function Index() {
  const {
    currentSoundId,
    isPlaying,
    playSound,
    stopSound,
    shouldAnimateControls,
  } = useSound();

  // Default to first set if no sound is selected
  const activeSetId = currentSoundId || "01";
  const activeSet = sets.find((set) => set.id === activeSetId) || sets[0];

  // Create video player with the active set's video
  const player = useVideoPlayer(activeSet.video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Update video source only when the active set ID changes
  useEffect(() => {
    player.replaceAsync(activeSet.video);
  }, [activeSetId, player]);

  // Custom toggle handler that plays the active set if no sound is selected
  const handlePlayToggle = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      // Play the active set (the one whose video is showing)
      await playSound(activeSetId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-screen video */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      {/* Vignette Overlay */}
      <View style={styles.vignette} />

      {/* Heading - shown when not playing */}
      {!isPlaying && (
        <Animated.View
          entering={shouldAnimateControls ? FadeIn.duration(600) : undefined}
          exiting={shouldAnimateControls ? FadeOut.duration(400) : undefined}
          style={styles.headingContainer}
        >
          <Text style={styles.heading}>time to sleep well</Text>
        </Animated.View>
      )}

      {/* Home Controls */}
      <HomeControls isPlaying={isPlaying} onPlayToggle={handlePlayToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)",
    pointerEvents: "none",
  },
  headingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingInline: 24,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  heading: {
    fontSize: 50,
    fontFamily: "Satoshi",
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
