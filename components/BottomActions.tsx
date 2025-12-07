import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CloseIcon from "./icons/CloseIcon";
import Button from "./ui/Button";

interface BottomActionsProps {
  onClose: () => void;
  rightButton?: {
    label: string;
    onPress: () => void;
  };
  delay?: number;
  background?: boolean;
}

export default function BottomActions({
  onClose,
  rightButton,
  delay = 200,
  background = false,
}: BottomActionsProps) {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      {background && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120 + safeArea.bottom,
            pointerEvents: "none",
          }}
        />
      )}

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
            <Button square onPress={onClose}>
              <CloseIcon />
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
          entering={FadeInDown.duration(600)
            .springify()
            .damping(60)
            .delay(delay)}
          style={{
            position: "absolute",
            bottom: safeArea.bottom,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Button square onPress={onClose}>
            <CloseIcon />
          </Button>
        </Animated.View>
      )}
    </>
  );
}
