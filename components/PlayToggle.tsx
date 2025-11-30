import Button from "./ui/Button";
import PlayIcon from "./icons/PlayIcon";
import StopIcon from "./icons/StopIcon";
import { View } from "react-native";

export default function PlayToggle({
  small = false,
  isPlaying,
  onPress,
  isFadingOut = false,
}: {
  small?: boolean;
  isPlaying: boolean;
  onPress: () => void;
  isFadingOut?: boolean;
}) {
  small = true;
  const iconSize = small ? 16 : 24;

  return (
    <Button onPress={onPress} small={small}>
      <View
        style={{
          height: "100%",
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? (
          <StopIcon size={iconSize} />
        ) : (
          <PlayIcon size={iconSize} />
        )}
      </View>
    </Button>
  );
}
