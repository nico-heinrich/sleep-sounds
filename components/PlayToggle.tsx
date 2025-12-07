import Button from "./ui/Button";
import PlayIcon from "./icons/PlayIcon";
import StopIcon from "./icons/StopIcon";

export default function PlayToggle({
  small = false,
  isPlaying,
  onPress,
}: {
  small?: boolean;
  isPlaying: boolean;
  onPress: () => void;
}) {
  return (
    <Button square onPress={onPress} small={small}>
      {isPlaying ? <StopIcon mini={!!small} /> : <PlayIcon mini={!!small} />}
    </Button>
  );
}
