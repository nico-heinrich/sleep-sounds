import { Pressable, Text, View } from "react-native";
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
  disabled = false,
  onPress,
}: {
  small?: boolean;
  label?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const height = small ? 36 : 64;
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
        disabled={disabled}
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
                overflow: "hidden",
              },
              backgroundStyle,
            ]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {children}
              {label && (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize,
                    fontFamily: "Satoshi-Bold",
                    paddingStart: children ? padding * 1.25 : padding * 2,
                    paddingEnd: padding * 2,
                  }}
                >
                  {label}
                </Text>
              )}
            </View>
          </Animated.View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
