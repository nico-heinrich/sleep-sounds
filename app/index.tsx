import { View } from "react-native";
import { Link } from "expo-router";
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
      <Link href="/sounds" asChild>
        <Button label="Sounds" />
      </Link>
    </View>
  );
}
