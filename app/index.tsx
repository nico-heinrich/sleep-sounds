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
        <View>
          <Link href="/options" asChild>
            <Button label="Options" />
          </Link>
        </View>
      </View>
    </View>
  );
}
