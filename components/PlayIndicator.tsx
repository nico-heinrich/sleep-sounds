import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const BAR_WIDTH = 3;
const BAR_GAP = 4;
const MAX_HEIGHT = 20;
const MIN_HEIGHT = 8;
const ANIMATION_DURATION = 600;

function AnimatedBar({
  delay,
  maxHeight,
  isPlaying,
  x,
}: {
  delay: number;
  maxHeight: number;
  isPlaying: boolean;
  x: number;
}) {
  const height = useSharedValue(MIN_HEIGHT);

  useEffect(() => {
    if (isPlaying) {
      cancelAnimation(height);
      height.value = MIN_HEIGHT;

      const animation = withDelay(
        delay,
        withRepeat(
          withTiming(maxHeight, {
            duration: ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        ),
      );

      height.value = animation;
    }
  }, [isPlaying, delay, maxHeight]);

  const animatedProps = useAnimatedProps(() => {
    const currentHeight = height.value;
    const y = (MAX_HEIGHT - currentHeight) / 2;
    return {
      height: currentHeight,
      y: y,
    };
  });

  return (
    <AnimatedRect
      x={x}
      width={BAR_WIDTH}
      rx={BAR_WIDTH / 2}
      fill="white"
      animatedProps={animatedProps}
    />
  );
}

export default function PlayIndicator({ isPlaying }: { isPlaying: boolean }) {
  const opacity = useSharedValue(isPlaying ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(isPlaying ? 1 : 0, { duration: 200 });
  }, [isPlaying]);

  const svgProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  // Calculate x positions starting from 0
  const totalWidth = BAR_WIDTH * 3 + BAR_GAP * 2;
  const bar1X = 0;
  const bar2X = BAR_WIDTH + BAR_GAP;
  const bar3X = (BAR_WIDTH + BAR_GAP) * 2;

  return (
    <AnimatedSvg
      width={totalWidth}
      height={MAX_HEIGHT}
      viewBox={`0 0 ${totalWidth} ${MAX_HEIGHT}`}
      animatedProps={svgProps}
      style={{
        alignSelf: "center",
        height: MAX_HEIGHT,
        margin: 6,
      }}
    >
      <AnimatedBar
        delay={300}
        maxHeight={MAX_HEIGHT}
        isPlaying={isPlaying}
        x={bar1X}
      />
      <AnimatedBar
        delay={0}
        maxHeight={MAX_HEIGHT}
        isPlaying={isPlaying}
        x={bar2X}
      />
      <AnimatedBar
        delay={150}
        maxHeight={MAX_HEIGHT}
        isPlaying={isPlaying}
        x={bar3X}
      />
    </AnimatedSvg>
  );
}
