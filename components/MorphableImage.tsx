import React, { useEffect, useRef } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Image, ImageProps } from "expo-image";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useImageMorph } from "./ImageMorphProvider";

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface MorphableImageProps extends Omit<ImageProps, "source"> {
  source: string | number;
  id: string;
}

export function MorphableImage({ id, source, style, ...imageProps }: MorphableImageProps) {
  const navigation = useNavigation();
  const { registerImage, unregisterImage, startTransition } = useImageMorph();
  const viewRef = useRef<View>(null);
  const opacity = useSharedValue(1);
  const isTransitioning = useRef(false);
  const layoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const updateLayout = () => {
    if (viewRef.current) {
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        const layout = {
          x: pageX,
          y: pageY,
          width,
          height,
        };
        layoutRef.current = layout;
        registerImage(id, layout, source);
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Small delay to ensure layout is complete
      const timer = setTimeout(() => {
        updateLayout();
        if (isTransitioning.current) {
          opacity.value = withTiming(1, { duration: 300 });
          isTransitioning.current = false;
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }, [id, source, registerImage, opacity])
  );

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      // When leaving this screen, hide the image and trigger transition
      isTransitioning.current = true;
      opacity.value = withTiming(0, { duration: 150 });
      setTimeout(() => {
        startTransition(id, id);
      }, 50);
    });

    const unsubscribeFocus = navigation.addListener("focus", () => {
      // When entering this screen, show the image after transition
      setTimeout(() => {
        updateLayout();
        opacity.value = withTiming(1, { duration: 300 });
      }, 200);
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
      unregisterImage(id);
    };
  }, [navigation, id, startTransition, opacity, unregisterImage]);

  const onLayout = (event: LayoutChangeEvent) => {
    updateLayout();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View ref={viewRef} onLayout={onLayout} collapsable={false}>
      <AnimatedImage
        {...imageProps}
        source={source as any}
        style={[style, animatedStyle]}
      />
    </View>
  );
}

