import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import GlassPane from "./GlassPane";

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
  const height = small ? 28 : 56;
  const padding = small ? 6 : 14;
  const fontSize = small ? 14 : 16;

  const scale = useSharedValue(1);
  const lightness = useSharedValue(0);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glassPaneStyle = useAnimatedStyle(() => ({
    opacity: lightness.value * 0.1,
  }));

  const handlePressIn = useCallback(() => {
    if (!small) {
      scale.value = withTiming(1.05, { duration: 150 });
    }
    lightness.value = withTiming(1, { duration: 150 });
  }, [small]);

  const handlePressOut = useCallback(() => {
    if (!small) {
      scale.value = withTiming(1, { duration: 300 });
    }
    lightness.value = withTiming(0, { duration: 300 });
  }, [small]);

  return (
    <Animated.View style={[{ height }, scaleStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ height: "100%" }}
        disabled={disabled}
      >
        <View style={{ position: "relative", height: "100%" }}>
          <GlassPane borderRadius={24}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                opacity: disabled ? 0.5 : 1,
                pointerEvents: "none",
              }}
            >
              {children}
              {label && (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize,
                    fontFamily: "Satoshi",
                    paddingStart: children ? padding * 1.25 : padding * 2,
                    paddingEnd: padding * 2,
                  }}
                >
                  {label}
                </Text>
              )}
            </View>
          </GlassPane>
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                backgroundColor: "white",
                pointerEvents: "none",
              },
              glassPaneStyle,
            ]}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}
