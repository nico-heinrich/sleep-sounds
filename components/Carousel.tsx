import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useSound } from "../contexts/SoundContext";
import { sets } from "../data/sets";
import PlayIndicator from "./PlayIndicator";
import PlayToggle from "./PlayToggle";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_GAP = 18;
const ITEM_SIZE = ITEM_WIDTH + ITEM_GAP;

const FADE_OUT_DURATION = 200;
const FADE_IN_DURATION = 1000;
const HEADING_DELAY = 200;
const BODY_DELAY = 400;
const MANUAL_PLAY_COOLDOWN = 100;

// Helper function to calculate input range for interpolation
const getInputRange = (index: number) => [
  (index - 1) * ITEM_SIZE,
  index * ITEM_SIZE,
  (index + 1) * ITEM_SIZE,
];

// Helper function to extract first 2 sentences
const getFirstTwoSentences = (text: string): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(" ").trim();
};

interface CarouselItemProps {
  item: any;
  index: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
  soundId: string;
  playSound: (id: string) => Promise<void>;
  togglePlay: () => void;
  currentSoundId: string | null;
  isPlaying: boolean;
  isFadingOut: boolean;
}

function CarouselItem({
  item,
  index,
  scrollX,
  soundId,
  playSound,
  togglePlay,
  currentSoundId,
  isPlaying,
  isFadingOut,
}: CarouselItemProps) {
  const inputRange = getInputRange(index);

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

  const isItemActive = isPlaying && currentSoundId === soundId;
  const isItemFadingOut = isFadingOut && currentSoundId === soundId;

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
            height: (ITEM_WIDTH * 4) / 3,
            borderRadius: 48,
          }}
        />
        <View style={{ position: "absolute", bottom: 24, left: 24 }}>
          <PlayToggle small isPlaying={isItemActive} onPress={handlePress} />
        </View>
        <View style={{ position: "absolute", bottom: 24, right: 24 }}>
          <PlayIndicator
            isPlaying={isItemActive}
            isFadingOut={isItemFadingOut}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface CarouselProps {
  onReadMore?: (index: number) => void;
  onIndexChange?: (index: number) => void;
}

export default function Carousel({ onReadMore, onIndexChange }: CarouselProps) {
  const safeArea = useSafeAreaInsets();
  const { currentSoundId, isPlaying, isFadingOut, playSound, togglePlay } =
    useSound();

  // Shared values for animations
  const scrollX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const isInitialized = useSharedValue(false);
  const headingAppearance = sets.map((_, index) =>
    useSharedValue(index === 0 ? 1 : 0),
  );
  const bodyAppearance = sets.map((_, index) =>
    useSharedValue(index === 0 ? 1 : 0),
  );

  // React state and refs
  const flatListRef = useRef<Animated.FlatList>(null);
  const isInitializedRef = useRef(false);
  const isManualPlayRef = useRef(false);

  // Initialize component state
  useEffect(() => {
    scrollX.value = 0;
    currentIndex.value = 0;
    isManualPlayRef.current = false;

    headingAppearance.forEach((value, index) => {
      value.value = index === 0 ? 1 : 0;
    });
    bodyAppearance.forEach((value, index) => {
      value.value = index === 0 ? 1 : 0;
    });

    // Notify parent of initial index
    if (onIndexChange) {
      onIndexChange(0);
    }
  }, [onIndexChange]);

  // Reset scroll position when FlatList is ready
  const handleFlatListLayout = () => {
    if (flatListRef.current && !isInitializedRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      scrollX.value = 0;
      currentIndex.value = 0;
      requestAnimationFrame(() => {
        isInitializedRef.current = true;
        isInitialized.value = true;
      });
    }
  };

  // Handle manual sound play (prevents auto-switch immediately after)
  const handlePlaySound = async (soundId: string) => {
    isManualPlayRef.current = true;
    try {
      await playSound(soundId);
      setTimeout(() => {
        isManualPlayRef.current = false;
      }, MANUAL_PLAY_COOLDOWN);
    } catch (error) {
      isManualPlayRef.current = false;
      throw error;
    }
  };

  // Switch audio when index changes (if playing)
  const switchAudio = (idx: number) => {
    if (!isPlaying) return;

    const newSoundId = sets[idx].id;
    if (currentSoundId !== newSoundId) {
      playSound(newSoundId);
    }
  };

  // Handle haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS === "android") {
      Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Segment_Frequent_Tick,
      );
    } else {
      Haptics.selectionAsync();
    }
  };

  // Handle text appearance animations and audio switching when index changes
  useAnimatedReaction(
    () => currentIndex.value,
    (currentIdx, previousIdx) => {
      if (previousIdx === null || currentIdx === previousIdx) return;
      if (currentIdx < 0 || currentIdx >= sets.length) return;

      // Trigger haptic feedback
      if (isInitialized.value) {
        scheduleOnRN(triggerHaptic);
      }

      // Notify parent component of index change
      if (onIndexChange) {
        runOnJS(onIndexChange)(currentIdx);
      }

      // Switch audio at the same time as text
      scheduleOnRN(switchAudio, currentIdx);

      // Fade out previous item
      if (previousIdx >= 0 && previousIdx < sets.length) {
        headingAppearance[previousIdx].value = withTiming(0, {
          duration: FADE_OUT_DURATION,
        });
        bodyAppearance[previousIdx].value = withTiming(0, {
          duration: FADE_OUT_DURATION,
        });
      }

      // Reset all other items
      sets.forEach((_, idx) => {
        if (idx !== currentIdx && idx !== previousIdx) {
          headingAppearance[idx].value = 0;
          bodyAppearance[idx].value = 0;
        }
      });

      // Fade in current item
      headingAppearance[currentIdx].value = withDelay(
        HEADING_DELAY,
        withTiming(1, { duration: FADE_IN_DURATION }),
      );
      bodyAppearance[currentIdx].value = withDelay(
        BODY_DELAY,
        withTiming(1, { duration: FADE_IN_DURATION }),
      );
    },
  );

  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const newIndex = Math.round(event.contentOffset.x / ITEM_SIZE);

      // Update index if it changed and is valid
      if (
        newIndex !== currentIndex.value &&
        newIndex >= 0 &&
        newIndex < sets.length
      ) {
        currentIndex.value = newIndex;
      }
    },
  });

  const dataWithSpacers = [
    { id: "left-spacer" },
    ...sets,
    { id: "right-spacer" },
  ];

  // Render background blur images
  const renderBackgroundImages = () => (
    <View style={StyleSheet.absoluteFill}>
      {sets.map((item, index) => {
        const inputRange = getInputRange(index);
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
  );

  // Render text overlay
  const renderTextOverlay = () => (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "box-none",
      }}
    >
      {sets.map((item, index) => {
        const headingOpacity = useAnimatedStyle(() => ({
          opacity: headingAppearance[index].value,
        }));

        const bodyOpacity = useAnimatedStyle(() => ({
          opacity: bodyAppearance[index].value,
        }));

        const truncatedBody = getFirstTwoSentences(item.body || "");
        const hasMore = truncatedBody.length < (item.body || "").trim().length;

        return (
          <View
            key={item.id}
            style={{
              position: "absolute",
              top: 450,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
            }}
          >
            <Animated.Text
              style={[
                {
                  color: "white",
                  fontSize: 32,
                  fontFamily: "Satoshi",
                  fontWeight: "700",
                  textAlign: "center",
                },
                headingOpacity,
              ]}
              pointerEvents="none"
            >
              {item.heading || ""}
            </Animated.Text>
            <Animated.View
              style={[
                {
                  marginTop: 16,
                  marginBottom: safeArea.bottom + 120,
                },
                bodyOpacity,
              ]}
              pointerEvents="box-none"
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontFamily: "Satoshi",
                  textAlign: "center",
                  opacity: 0.8,
                }}
                pointerEvents="none"
              >
                {truncatedBody}
                {hasMore && " "}
              </Text>
              {hasMore && (
                <Pressable
                  onPress={() => {
                    onReadMore?.(index);
                  }}
                  hitSlop={8}
                  style={{ alignSelf: "center" }}
                >
                  <Text
                    suppressHighlighting
                    style={{
                      textDecorationLine: "underline",
                      color: "white",
                      opacity: 0.9,
                      fontSize: 18,
                      fontFamily: "Satoshi",
                      textAlign: "center",
                      marginTop: 2,
                    }}
                  >
                    Read more
                  </Text>
                </Pressable>
              )}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );

  // Render carousel item or spacer
  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    if (item.id === "left-spacer" || item.id === "right-spacer") {
      return <View style={{ width: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }} />;
    }

    const adjustedIndex = index - 1;
    return (
      <CarouselItem
        item={item}
        index={adjustedIndex}
        scrollX={scrollX}
        soundId={item.id}
        playSound={handlePlaySound}
        togglePlay={togglePlay}
        currentSoundId={currentSoundId}
        isPlaying={isPlaying}
        isFadingOut={isFadingOut}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderBackgroundImages()}
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          ref={flatListRef}
          data={dataWithSpacers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate={0.1}
          disableIntervalMomentum={true}
          snapToInterval={ITEM_SIZE}
          contentContainerStyle={{ paddingTop: safeArea.top + 40 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          initialScrollIndex={0}
          onLayout={handleFlatListLayout}
          renderItem={renderCarouselItem}
        />
        {renderTextOverlay()}
      </View>
    </View>
  );
}
