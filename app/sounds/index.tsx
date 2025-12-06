import { useRouter } from "expo-router";
import { View } from "react-native";
import BottomActions from "../../components/BottomActions";
import Carousel from "../../components/Carousel";
import { useSound } from "../../contexts/SoundContext";

export default function Sounds() {
  const router = useRouter();
  const { stopSound } = useSound();

  const handleClose = () => {
    stopSound();
    router.push("/");
  };

  const handleSelect = () => {
    stopSound();
    router.push("/");
  };

  const handleReadMore = (index: number) => {
    router.push(`/sounds/${index}`);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Carousel onReadMore={handleReadMore} />
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
