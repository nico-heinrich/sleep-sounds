import { Text, View } from "react-native";
import { Link } from "expo-router";
import Animated from "react-native-reanimated";

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
      <Animated.Image
        sharedTransitionTag="logo"
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={{ width: 64, height: 64, marginTop: 20 }}
      />
      <Link href="/options" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Options
      </Link>
    </View>
  );
}
