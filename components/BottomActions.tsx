import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "./ui/Button";
import CloseIcon from "./icons/CloseIcon";

interface BottomActionsProps {
  onClose: () => void;
  rightButton?: {
    label: string;
    onPress: () => void;
  };
  delay?: number;
}

export default function BottomActions({
  onClose,
  rightButton,
  delay = 200,
}: BottomActionsProps) {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120 + safeArea.bottom,
          pointerEvents: "none",
        }}
      />

      {rightButton ? (
        // Two button layout: close on left, action on right
        <>
          <Animated.View
            entering={FadeInLeft.duration(600)
              .springify()
              .damping(60)
              .delay(delay)}
            style={{ position: "absolute", bottom: safeArea.bottom, left: 24 }}
          >
            <Button onPress={onClose}>
              <View
                style={{
                  height: "100%",
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CloseIcon size={20} />
              </View>
            </Button>
          </Animated.View>
          <Animated.View
            entering={FadeInRight.duration(600)
              .springify()
              .damping(60)
              .delay(delay)}
            style={{
              position: "absolute",
              bottom: safeArea.bottom,
              right: 24,
            }}
          >
            <Button label={rightButton.label} onPress={rightButton.onPress} />
          </Animated.View>
        </>
      ) : (
        // Single button layout: close button centered
        <Animated.View
          entering={ZoomIn.duration(600).springify().damping(60).delay(delay)}
          style={{
            position: "absolute",
            bottom: safeArea.bottom,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Button onPress={onClose}>
            <View
              style={{
                height: "100%",
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CloseIcon size={20} />
            </View>
          </Button>
        </Animated.View>
      )}
    </>
  );
}
