import { Pressable, Text, View } from "react-native";

export default function Button({
  variant = "primary",
  label,
  children,
  onPress,
}: {
  variant?: "primary" | "secondary";
  label: string;
  children?: React.ReactNode;
  onPress: () => void;
}) {
  const backgroundColor = variant === "primary" ? "#007bff" : "#6c757d";
  const textColor = "#ffffff";

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor,
          padding: 12,
          borderRadius: 9999,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {children}
        {label && (
          <Text
            style={{
              color: textColor,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
              paddingHorizontal: 8,
            }}
          >
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
