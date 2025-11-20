import { Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import Animated from "react-native-reanimated";

export default function Options() {
  return (
    <ScrollView>
      <Text style={{ marginTop: 100 }}>This is the options screen</Text>
      <Animated.Image
        sharedTransitionTag="logo"
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={{ width: "100%", height: 200, marginTop: 20 }}
      />
      <Link href="/" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Main
      </Link>
      <Text style={{ marginHorizontal: 20, fontSize: 14 }}>
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </Text>
    </ScrollView>
  );
}
