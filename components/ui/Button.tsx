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
  const height = small ? 42 : 64;
  const padding = small ? 6 : 8;
  const fontSize = small ? 14 : 16;

  const scale = useRef(new Animated.Value(1)).current;
  const backgroundColor = scale.interpolate({
    inputRange: [0.95, 1],
    outputRange: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"],
  });

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
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
          intensity={40}
          style={{
            height: "100%",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              padding,
              borderRadius: 9999,
              flexDirection: "row",
              alignItems: "center",
              overflow: "hidden",
              backgroundColor,
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
          </Animated.View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
