import { Pressable, Text } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useCallback } from "react";

export default function Button({
  small = false,
  label,
  children,
  onPress,
}: {
  small?: boolean;
  label?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  const height = small ? 42 : 64;
  const padding = small ? 6 : 8;
  const fontSize = small ? 14 : 16;

  const scale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scale.value,
      [0.95, 1],
      ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"],
    ),
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 150 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 300 });
  }, []);

  return (
    <Animated.View style={[{ height }, scaleStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ height: "100%" }}
      >
        <BlurView
          intensity={40}
          style={{
            height: "100%",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={[
              {
                height: "100%",
                padding,
                borderRadius: 9999,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
              },
              backgroundStyle,
            ]}
          >
            {children}
            {label && (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize,
                  fontWeight: "600",
                  paddingStart: children ? padding * 1.25 : padding * 2,
                  paddingEnd: padding * 2,
                }}
              >
                {label}
              </Text>
            )}
          </Animated.View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
