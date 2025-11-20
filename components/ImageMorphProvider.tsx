import React, { createContext, useContext, useState, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ImageLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageData {
  id: string;
  layout: ImageLayout;
  source: string | number;
}

interface ImageMorphContextType {
  registerImage: (id: string, layout: ImageLayout, source: string | number) => void;
  unregisterImage: (id: string) => void;
  startTransition: (fromId: string, toId: string) => void;
}

const ImageMorphContext = createContext<ImageMorphContextType | null>(null);

export function ImageMorphProvider({ children }: { children: React.ReactNode }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlaySource, setOverlaySource] = useState<string | number>("");
  const images = useRef<Map<string, ImageData>>(new Map());

  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);
  const overlayWidth = useSharedValue(0);
  const overlayHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(1);

  const registerImage = (id: string, layout: ImageLayout, source: string | number) => {
    images.current.set(id, { id, layout, source });
  };

  const unregisterImage = (id: string) => {
    images.current.delete(id);
  };

  const hideOverlay = () => {
    setOverlayVisible(false);
  };

  const startTransition = (fromId: string, toId: string) => {
    const fromImage = images.current.get(fromId);
    const toImage = images.current.get(toId);

    if (!fromImage || !toImage) {
      // If target not ready, wait a bit and try again
      setTimeout(() => startTransition(fromId, toId), 50);
      return;
    }

    setOverlaySource(fromImage.source);
    setOverlayVisible(true);

    // Start from source position
    overlayX.value = fromImage.layout.x;
    overlayY.value = fromImage.layout.y;
    overlayWidth.value = fromImage.layout.width;
    overlayHeight.value = fromImage.layout.height;
    overlayOpacity.value = 1;
    overlayScale.value = 1;

    // Animate to target position with spring physics
    requestAnimationFrame(() => {
      overlayX.value = withSpring(toImage.layout.x, {
        damping: 20,
        stiffness: 90,
        mass: 0.5,
      });
      overlayY.value = withSpring(toImage.layout.y, {
        damping: 20,
        stiffness: 90,
        mass: 0.5,
      });
      overlayWidth.value = withSpring(toImage.layout.width, {
        damping: 20,
        stiffness: 90,
        mass: 0.5,
      });
      overlayHeight.value = withSpring(toImage.layout.height, {
        damping: 20,
        stiffness: 90,
        mass: 0.5,
      });

      // Fade out after animation completes
      setTimeout(() => {
        overlayOpacity.value = withSpring(0, { damping: 20, stiffness: 90 }, () => {
          runOnJS(hideOverlay)();
        });
      }, 300);
    });
  };

  const overlayStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: overlayX.value,
      top: overlayY.value,
      width: overlayWidth.value,
      height: overlayHeight.value,
      opacity: overlayOpacity.value,
      zIndex: 9999,
    };
  });

  return (
    <ImageMorphContext.Provider value={{ registerImage, unregisterImage, startTransition }}>
      {children}
      {overlayVisible && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={overlayStyle}>
            <Image
              source={overlaySource}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </Animated.View>
        </View>
      )}
    </ImageMorphContext.Provider>
  );
}

export function useImageMorph() {
  const context = useContext(ImageMorphContext);
  if (!context) {
    throw new Error("useImageMorph must be used within ImageMorphProvider");
  }
  return context;
}

