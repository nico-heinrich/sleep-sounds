import { Text, ScrollView, View } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Options() {
  return (
    <View style={{ backgroundColor: "black" }}>
      <Animated.View entering={FadeInDown.duration(600).damping(20)}>
        <ScrollView>
          <Text
            style={{ marginTop: 100, color: "white", fontFamily: "Satoshi" }}
          >
            This is the options screen
          </Text>
          <Link
            href="/"
            style={{
              marginTop: 20,
              fontSize: 18,
              color: "white",
              fontFamily: "Satoshi",
            }}
          >
            Go to Main
          </Link>
          <View
            style={{ width: "100%", height: 200, backgroundColor: "blue" }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 14,
              color: "white",
              fontFamily: "Satoshi",
            }}
          >
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod. lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit
            amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem
            ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod. lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quod. lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quod. lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor sit
            amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quisquam, quod. lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam, quod. lorem
            ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod. lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quod. lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quod.
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
