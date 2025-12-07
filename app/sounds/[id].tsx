import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomActions from "../../components/BottomActions";
import { sets } from "../../data/sets";

export default function SoundDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const safeArea = useSafeAreaInsets();

  const setIndex = parseInt(id || "0", 10);
  const set = sets[setIndex];

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
          <View>
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

            <Text
              style={{
                color: "white",
                fontSize: 32,
                fontFamily: "Satoshi",
                fontWeight: "700",
                marginBottom: 16,
              }}
            >
              {set.heading}
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontFamily: "Satoshi",
                opacity: 0.8,
                lineHeight: 28,
              }}
            >
              {set.body}
            </Text>
          </View>
        </ScrollView>

        <BottomActions onClose={() => router.back()} delay={400} background />
      </View>
    </View>
  );
}
