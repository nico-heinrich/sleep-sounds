import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import BottomActions from "../../components/BottomActions";
import Carousel from "../../components/Carousel";
import { useSound } from "../../contexts/SoundContext";
import { sets } from "../../data/sets";

export default function Sounds() {
  const router = useRouter();
  const { playSound, currentSoundId } = useSound();
  
  // Find the index of the current sound, default to 0 if not found
  const initialIndex = currentSoundId 
    ? sets.findIndex(set => set.id === currentSoundId)
    : 0;
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const handleClose = useCallback(() => {
    // Just go back, keep current sound playing
    router.push("/");
  }, [router]);

  const handleSelect = useCallback(async () => {
    // Play the currently displayed sound
    const selectedSound = sets[currentCarouselIndex];
    if (selectedSound) {
      await playSound(selectedSound.id);
    }
    router.push("/");
  }, [currentCarouselIndex, playSound, router]);

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
