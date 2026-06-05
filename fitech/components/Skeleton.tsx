import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';

const SHIMMER_DURATION_MS = 1200;

type SkeletonBoxProps = {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonBoxProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const layoutWidth = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => {
    const w = layoutWidth.value;
    if (w <= 0) {
      return { opacity: 0 };
    }
    return {
      transform: [{ translateX: -w + progress.value * w * 2 }],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    layoutWidth.value = event.nativeEvent.layout.width;
  };

  const highlight = theme.isDark
    ? 'rgba(255,255,255,0.14)'
    : 'rgba(0,0,0,0.06)';

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: theme.background.input,
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', highlight, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerBand}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shimmerBand: {
    width: '55%',
    height: '100%',
  },
});
