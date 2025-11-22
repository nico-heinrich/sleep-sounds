import { Pressable, Text, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useRef } from "react";

export default function Button({
  small = false,
  label,
  children,
  onPress,
}: {
  small?: boolean;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  const height = small ? 42 : 68;
  const padding = small ? 6 : 10;
  const fontSize = small ? 14 : 16;

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        height,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ height: "100%" }}
      >
        <BlurView
          style={{
            height: "100%",
            padding,
            borderRadius: 9999,
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
          }}
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
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
