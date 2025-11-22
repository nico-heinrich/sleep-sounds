import { View } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import Button from "../components/ui/Button";
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
      <View style={{ width: 300, height: 100, backgroundColor: "blue" }} />
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 400,
        }}
      >
        <Button>
          <View style={{ height: "100%", aspectRatio: 1, padding: 4 }}>
            <Image
              source="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSxPW899-uuRZrk7gesaoMWDCyzn1wnmaI9XWCplVzew&s"
              style={{ height: "100%", width: "100%" }}
            />
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
