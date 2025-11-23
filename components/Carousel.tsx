import { View, Dimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { sets } from "../data/sets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.6;
const ITEM_GAP = 48;

// individual carousel item component
function CarouselItem({ item, index, scrollX }: any) {
  const inputRange = [
    (index - 1) * (ITEM_WIDTH + ITEM_GAP),
    index * (ITEM_WIDTH + ITEM_GAP),
    (index + 1) * (ITEM_WIDTH + ITEM_GAP),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, inputRange, [8, 0, -8]);
    const translateY = interpolate(scrollX.value, inputRange, [18, 0, 18]);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);

    return {
      transform: [{ rotate: `${rotate}deg` }, { translateY }],
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
    <View style={{ width: "100%", height: 400 }}>
      <Animated.FlatList
        data={dataWithSpacers}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + ITEM_GAP}
        contentContainerStyle={{
          alignItems: "center",
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (item.id === "left-spacer" || item.id === "right-spacer") {
            return <View style={{ width: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }} />;
          }

          // adjust index because of left spacer
          const adjustedIndex = index - 1;

          return (
            <CarouselItem item={item} index={adjustedIndex} scrollX={scrollX} />
          );
        }}
      />
    </View>
  );
}
