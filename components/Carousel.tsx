import { Image } from "expo-image";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sets } from "../data/sets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_GAP = 18;

// individual carousel item component
function CarouselItem({ item, index, scrollX }: any) {
  const inputRange = [
    (index - 1) * (ITEM_WIDTH + ITEM_GAP),
    index * (ITEM_WIDTH + ITEM_GAP),
    (index + 1) * (ITEM_WIDTH + ITEM_GAP),
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

  return (
    <Animated.View
      style={[
        animatedStyle,
        { marginEnd: index === sets.length - 1 ? 0 : ITEM_GAP },
      ]}
    >
      <Image
        source={item.image}
        contentFit="cover"
        style={{
          width: ITEM_WIDTH,
          height: 320,
          borderRadius: 48,
        }}
      />
    </Animated.View>
  );
}

export default function Carousel() {
  const safeArea = useSafeAreaInsets();

  const dataWithSpacers = [
    { id: "left-spacer" },
    ...sets,
    { id: "right-spacer" },
  ];

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {/* BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill}>
        {sets.map((item, index) => {
          const inputRange = [
            (index - 1) * (ITEM_WIDTH + ITEM_GAP),
            index * (ITEM_WIDTH + ITEM_GAP),
            (index + 1) * (ITEM_WIDTH + ITEM_GAP),
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
        {/* CAROUSEL */}
        <Animated.FlatList
          data={dataWithSpacers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={ITEM_WIDTH + ITEM_GAP}
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
            const ITEM_FULL_SCROLL = ITEM_WIDTH + ITEM_GAP; // the scroll distance for one item

            const inputRange = [
              (index - 0.5) * ITEM_FULL_SCROLL, // start fade in
              index * ITEM_FULL_SCROLL, // fully visible at center
              (index + 0.5) * ITEM_FULL_SCROLL, // fade out
            ];

            const outputRange = [0, 1, 0];

            const animatedTextStyle = useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollX.value,
                inputRange,
                outputRange,
                "clamp",
              );
              return { opacity };
            });

            return (
              <Animated.View
                key={item.id}
                style={[
                  {
                    position: "absolute",
                    top: 430,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 24,
                  },
                  animatedTextStyle,
                ]}
                pointerEvents="none"
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 32,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {item.heading || ""}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textAlign: "center",
                    marginTop: 12,
                    marginBottom: safeArea.bottom + 120,
                    opacity: 0.8,
                  }}
                >
                  {item.body || ""}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
