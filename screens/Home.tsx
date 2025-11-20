import { Text, TouchableOpacity, View } from "react-native";
import { MorphableImage } from "../components/MorphableImage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Options: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgray",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <MorphableImage
        id="shared-image"
        source="https://reactnative.dev/img/tiny_logo.png"
        style={{ width: 64, height: 64, marginTop: 20 }}
        contentFit="cover"
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Options")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontSize: 18 }}>Go to Options</Text>
      </TouchableOpacity>
    </View>
  );
}
