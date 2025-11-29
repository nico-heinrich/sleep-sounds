import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useSound } from "../contexts/SoundContext";
import { sets } from "../data/sets";
import PlayIndicator from "./PlayIndicator";
import PlayToggle from "./PlayToggle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_GAP = 18;
const ITEM_SIZE = ITEM_WIDTH + ITEM_GAP;

const FADE_OUT_DURATION = 200;
const FADE_IN_DURATION = 1000;
const HEADING_DELAY = 200;
const BODY_DELAY = 400;

function CarouselItem({
  item,
  index,
  scrollX,
  soundId,
  playSound,
  togglePlay,
  currentSoundId,
  isPlaying,
  currentIndex,
}: {
  item: any;
  index: number;
  scrollX: any;
  soundId: string;
  playSound: (id: string) => Promise<void>;
  togglePlay: () => void;
  currentSoundId: string | null;
  isPlaying: boolean;
  currentIndex: number;
}) {
  const inputRange = [
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
    (index + 1) * ITEM_SIZE,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, inputRange, [8, 0, -8]);
    const translateY = interpolate(scrollX.value, inputRange, [8, 0, 8]);
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9]);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);

    return {
      transform: [{ rotate: `${rotate}deg` }, { translateY }, { scale }],
      opacity,
    };
  });

  const isCurrentItem = index === currentIndex;
  const itemIsPlaying = isPlaying && currentSoundId === soundId && isCurrentItem;

  const handlePress = async () => {
    if (currentSoundId === soundId) {
      togglePlay();
    } else {
      await playSound(soundId);
    }
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        { marginEnd: index === sets.length - 1 ? 0 : ITEM_GAP },
      ]}
    >
      <Pressable onPress={handlePress} style={{ position: "relative" }}>
        <Image
          source={item.image}
          contentFit="cover"
          style={{
            width: ITEM_WIDTH,
            height: 320,
            borderRadius: 48,
          }}
        />
        <View style={{ position: "absolute", bottom: 24, left: 24 }}>
          <PlayToggle
            small
            isPlaying={itemIsPlaying}
            onPress={handlePress}
          />
        </View>
        <View style={{ position: "absolute", bottom: 24, right: 24 }}>
          <PlayIndicator isPlaying={itemIsPlaying} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function Carousel() {
  const safeArea = useSafeAreaInsets();
  const { currentSoundId, isPlaying, playSound, togglePlay } = useSound();
  const [currentIndexState, setCurrentIndexState] = useState(0);

  const dataWithSpacers = [
    { id: "left-spacer" },
    ...sets,
    { id: "right-spacer" },
  ];

  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const headingAppearance = sets.map((_, index) =>
    useSharedValue(index === 0 ? 1 : 0),
  );
  const bodyAppearance = sets.map((_, index) =>
    useSharedValue(index === 0 ? 1 : 0),
  );

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Sync currentIndex shared value to state for use in React components
  useAnimatedReaction(
    () => currentIndex.value,
    (currentIdx) => {
      if (currentIdx >= 0 && currentIdx < sets.length) {
        runOnJS(setCurrentIndexState)(currentIdx);
      }
    },
  );

  // Auto-switch sound when carousel index changes and isPlaying is true
  useEffect(() => {
    if (isPlaying && currentIndexState >= 0 && currentIndexState < sets.length) {
      const newSoundId = sets[currentIndexState].id;
      if (currentSoundId !== newSoundId) {
        playSound(newSoundId);
      }
    }
  }, [currentIndexState, isPlaying, currentSoundId, playSound]);

  useAnimatedReaction(
    () => currentIndex.value,
    (currentIdx, previousIdx) => {
      if (previousIdx !== null && currentIdx !== previousIdx) {
        if (previousIdx >= 0 && previousIdx < sets.length) {
          headingAppearance[previousIdx].value = withTiming(0, {
            duration: FADE_OUT_DURATION,
          });
          bodyAppearance[previousIdx].value = withTiming(0, {
            duration: FADE_OUT_DURATION,
          });
        }

        sets.forEach((_, idx) => {
          if (idx !== currentIdx && idx !== previousIdx) {
            headingAppearance[idx].value = 0;
            bodyAppearance[idx].value = 0;
          }
        });

        if (currentIdx >= 0 && currentIdx < sets.length) {
          headingAppearance[currentIdx].value = withDelay(
            HEADING_DELAY,
            withTiming(1, { duration: FADE_IN_DURATION }),
          );
          bodyAppearance[currentIdx].value = withDelay(
            BODY_DELAY,
            withTiming(1, { duration: FADE_IN_DURATION }),
          );
        }
      }
    },
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      const newIndex = Math.round(event.contentOffset.x / ITEM_SIZE);

      if (
        newIndex !== currentIndex.value &&
        newIndex >= 0 &&
        newIndex < sets.length
      ) {
        currentIndex.value = newIndex;
        scheduleOnRN(triggerHaptic);
      }
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        {sets.map((item, index) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const animatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(scrollX.value, inputRange, [0, 0.5, 0]);
            return { opacity };
          });

          return (
            <Animated.View
              key={item.id}
              style={[StyleSheet.absoluteFill, animatedStyle]}
            >
              <Image
                source={item.image}
                contentFit="cover"
                style={StyleSheet.absoluteFill}
                blurRadius={50}
              />
            </Animated.View>
          );
        })}
      </View>

      <View style={{ flex: 1 }}>
        <Animated.FlatList
          data={dataWithSpacers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate={0.1}
          disableIntervalMomentum={true}
          snapToInterval={ITEM_SIZE}
          contentContainerStyle={{ paddingTop: safeArea.top + 20 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          renderItem={({ item, index }) => {
            if (item.id === "left-spacer" || item.id === "right-spacer") {
              return (
                <View style={{ width: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }} />
              );
            }
            const adjustedIndex = index - 1;
            return (
              <CarouselItem
                item={item}
                index={adjustedIndex}
                scrollX={scrollX}
                soundId={item.id}
                playSound={playSound}
                togglePlay={togglePlay}
                currentSoundId={currentSoundId}
                isPlaying={isPlaying}
                currentIndex={currentIndexState}
              />
            );
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          {sets.map((item, index) => {
            const headingOpacity = useAnimatedStyle(() => ({
              opacity: headingAppearance[index].value,
            }));

            const bodyOpacity = useAnimatedStyle(() => ({
              opacity: bodyAppearance[index].value,
            }));

            return (
              <View
                key={item.id}
                style={{
                  position: "absolute",
                  top: 430,
                  left: 0,
                  right: 0,
                  paddingHorizontal: 24,
                }}
                pointerEvents="none"
              >
                <Animated.Text
                  style={[
                    {
                      color: "white",
                      fontSize: 32,
                      fontFamily: "Satoshi-Bold",
                      textAlign: "center",
                    },
                    headingOpacity,
                  ]}
                >
                  {item.heading || ""}
                </Animated.Text>
                <Animated.Text
                  style={[
                    {
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Satoshi-Regular",
                      textAlign: "center",
                      marginTop: 16,
                      marginBottom: safeArea.bottom + 120,
                      opacity: 0.8,
                    },
                    bodyOpacity,
                  ]}
                >
                  {item.body || ""}
                </Animated.Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
