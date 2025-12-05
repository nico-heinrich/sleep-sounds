import { View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function GlassPane({
  borderRadius = 24,
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  children,
}: {
  borderRadius?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <BlurView
      intensity={40}
      style={{
        height: "100%",
        overflow: "hidden",
        backgroundColor,
        borderRadius,
      }}
    >
      <MaskedView
        style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}
        maskElement={
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius,
              borderWidth: 1,
            }}
          />
        }
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.05)",
            "rgba(255,255,255,0.01)",
          ]}
          start={{ x: 0.59, y: 0.01 }}
          end={{ x: 0.41, y: 0.99 }}
          style={{ flex: 1 }}
        ></LinearGradient>
      </MaskedView>
      {children}
    </BlurView>
  );
}
