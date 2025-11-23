import { View } from "react-native";
import { Link } from "expo-router";
import Button from "../components/ui/Button";
import PlayIcon from "../components/icons/PlayIcon";
import Carousel from "../components/Carousel";

export default function Index() {
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
      <View
        style={{
          position: "absolute",
          bottom: 50,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Button>
          <View
            style={{
              height: "100%",
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlayIcon size={24} />
          </View>
        </Button>
        <View>
          <Link href="/options" asChild>
            <Button label="Auswählen" />
          </Link>
        </View>
      </View>
    </View>
  );
}
