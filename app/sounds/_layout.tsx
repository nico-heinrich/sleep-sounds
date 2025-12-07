import { Stack } from "expo-router";

export default function SoundsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "transparentModal",
          animation: "simple_push",
        }}
      />
    </Stack>
  );
}
