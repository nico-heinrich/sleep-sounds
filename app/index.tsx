import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeControls from "../components/HomeControls";
import { useSound } from "../contexts/SoundContext";
import { sets } from "../data/sets";

export default function Index() {
  const { currentSoundId, isPlaying, playSound, stopSound } = useSound();

  // Default to first set if no sound is selected
  const activeSetId = currentSoundId || "01";
  const activeSet = sets.find((set) => set.id === activeSetId) || sets[0];

  // Create video player with the active set's video
  const player = useVideoPlayer(activeSet.video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Update video source when active set changes
  useEffect(() => {
    player.replaceAsync(activeSet.video);
  }, [activeSet.video]);

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
});
