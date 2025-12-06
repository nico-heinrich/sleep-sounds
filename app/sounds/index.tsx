import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import BottomActions from "../../components/BottomActions";
import Carousel from "../../components/Carousel";
import { useSound } from "../../contexts/SoundContext";
import { sets } from "../../data/sets";

export default function Sounds() {
  const router = useRouter();
  const { playSound } = useSound();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

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
      <Carousel onReadMore={handleReadMore} onIndexChange={handleIndexChange} />
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
