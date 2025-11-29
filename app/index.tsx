import { View } from "react-native";
import { Link } from "expo-router";
import Button from "../components/ui/Button";
import CloseIcon from "../components/icons/CloseIcon";
import Carousel from "../components/Carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const safeArea = useSafeAreaInsets();

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
        <Button>
          <View
            style={{
              height: "100%",
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon size={24} />
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
        <Link href="/options" asChild>
          <Button label="Auswählen" />
        </Link>
      </View>
    </View>
  );
}
