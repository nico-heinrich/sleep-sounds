import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomActions from "../../components/BottomActions";
import { sets } from "../../data/sets";

export default function SoundDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const safeArea = useSafeAreaInsets();

  const opacity = useSharedValue(0);

  const setIndex = parseInt(id || "0", 10);
  const set = sets[setIndex];

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!set) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: safeArea.top + 24,
            paddingHorizontal: 24,
            paddingBottom: safeArea.bottom + 100,
          }}
        >
          <Animated.View style={contentStyle}>
            <Image
              source={set.image}
              contentFit="cover"
              style={{
                width: "100%",
                aspectRatio: 4 / 3,
                borderRadius: 48,
                marginBottom: 32,
              }}
            />

            <Animated.Text
              style={{
                color: "white",
                fontSize: 32,
                fontFamily: "Satoshi",
                fontWeight: "700",
                marginBottom: 16,
              }}
            >
              {set.heading}
            </Animated.Text>

            <Animated.Text
              style={{
                color: "white",
                fontSize: 18,
                fontFamily: "Satoshi",
                opacity: 0.8,
                lineHeight: 28,
              }}
            >
              {set.body}
            </Animated.Text>
          </Animated.View>
        </ScrollView>

        <BottomActions onClose={() => router.back()} />
      </View>
    </View>
  );
}
