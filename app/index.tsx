import { Text, View } from "react-native";
import { Link } from "expo-router";
import Button from "../components/ui/Button";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Lesss gooooo</Text>
      <Button
        variant="primary"
        label="Press Me"
        onPress={() => {
          alert("Button Pressed!");
        }}
      >
        <Text>🔥</Text>
      </Button>
      <Link href="/options" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Options
      </Link>
    </View>
  );
}
