import { ScrollView, Text, TouchableOpacity } from "react-native";
import { MorphableImage } from "../components/MorphableImage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Options: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Options">;

export default function Options({ navigation }: Props) {
  return (
    <ScrollView>
      <Text style={{ marginTop: 100 }}>This is the options screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontSize: 18 }}>Go to Main</Text>
      </TouchableOpacity>
      <MorphableImage
        id="shared-image"
        source="https://reactnative.dev/img/tiny_logo.png"
        style={{ width: "100%", height: 200, marginTop: 20, marginBottom: 20 }}
        contentFit="cover"
      />
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
