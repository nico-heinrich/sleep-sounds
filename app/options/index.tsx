import { Text, ScrollView, View } from "react-native";
import { Link } from "expo-router";

export default function Options() {
  return (
    <ScrollView>
      <Text style={{ marginTop: 100 }}>This is the options screen</Text>
      <Link href="/" style={{ marginTop: 20, fontSize: 18 }}>
        Go to Main
      </Link>
      <View style={{ width: "100%", height: 200, backgroundColor: "blue" }} />
      <View style={{ height: 200, width: "100%", backgroundColor: "blue" }} />
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
