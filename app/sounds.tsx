import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "../components/Carousel";
import CloseIcon from "../components/icons/CloseIcon";
import Button from "../components/ui/Button";
import { useSound } from "../contexts/SoundContext";

export default function Sounds() {
  const safeArea = useSafeAreaInsets();
  const router = useRouter();
  const { stopSound } = useSound();

  const handleNavigateHome = () => {
    stopSound();
    router.push("/");
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
      <Carousel />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120 + safeArea.bottom,
          pointerEvents: "none",
        }}
      />
      <View style={{ position: "absolute", bottom: safeArea.bottom, left: 24 }}>
        <Button onPress={handleNavigateHome}>
          <View
            style={{
              height: "100%",
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon size={20} />
          </View>
        </Button>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: safeArea.bottom,
          right: 24,
        }}
      >
        <Button label="Auswählen" onPress={handleNavigateHome} />
      </View>
    </View>
  );
}
