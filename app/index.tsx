import { Text, View } from "react-native";
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
      <Text>Lesss gooooo</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 600,
        }}
      >
        <Button small label="mini" onPress={() => {}}>
          <Image
            source="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
            style={{ height: "100%", aspectRatio: 1 }}
          />
        </Button>
        <View>
          <Button
            label="Select"
            onPress={() => {
              alert("Button Pressed!");
            }}
          >
            <Image
              source="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
              style={{ height: "100%", aspectRatio: 1 }}
            />
          </Button>
        </View>
        <View>
          <Button
            label="Secondary Button"
            onPress={() => {
              alert("Secondary Button Pressed!");
            }}
          />
        </View>
      </View>
      <Link href="/options" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Options
      </Link>
    </View>
  );
}
