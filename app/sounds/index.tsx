import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import BottomActions from "../../components/BottomActions";
import Carousel from "../../components/Carousel";
import { useSound } from "../../contexts/SoundContext";
import { sets } from "../../data/sets";

export default function Sounds() {
  const router = useRouter();
  const { selectSound, stopSound, currentSoundId, isPlaying } = useSound();
  
  // Find the index of the current sound, default to 0 if not found
  const initialIndex = currentSoundId 
    ? sets.findIndex(set => set.id === currentSoundId)
    : 0;
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const handleClose = useCallback(() => {
    // Just go back, keep current sound playing
    router.back();
  }, [router]);

  const handleSelect = useCallback(() => {
    const selectedSound = sets[currentCarouselIndex];
    
    // Select the currently displayed sound (updates the home screen video)
    if (selectedSound) {
      selectSound(selectedSound.id);
    }
    
    // If something is playing, fade it out during transition
    if (isPlaying) {
      stopSound();
    }
    
    // Navigate immediately
    router.back();
  }, [currentCarouselIndex, selectSound, stopSound, isPlaying, router]);

  const handleReadMore = useCallback((index: number) => {
    router.push(`/sounds/${index}`);
  }, [router]);

  const handleIndexChange = useCallback((index: number) => {
    setCurrentCarouselIndex(index);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Carousel 
        onReadMore={handleReadMore} 
        onIndexChange={handleIndexChange}
        initialIndex={initialIndex >= 0 ? initialIndex : 0}
      />
      <BottomActions
        onClose={handleClose}
        rightButton={{
          label: "Auswählen",
          onPress: handleSelect,
        }}
      />
    </View>
  );
}
