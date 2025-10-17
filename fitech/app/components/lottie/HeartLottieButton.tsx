// src/components/HeartLottieButton.tsx
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onPress: () => void; // your save action
  size?: number; // outer button size
  bg?: string; // button bg color
  border?: string; // optional border color
  lottieSize?: number; // heart animation size
  delayBeforeActionMs?: number; // small delay so animation is visible
  source?: any; // require('...heart.json') or {uri}
};

export default function HeartLottieButton({
  onPress,
  size = 72,
  lottieSize = 44,
  bg = '#ff3b30',
  border,
  delayBeforeActionMs = 260,
  source = require('@/assets/lottie/heart.json'),
}: Props) {
  const scale = useSharedValue(1);
  const lottieRef = useRef<LottieView>(null);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: 80 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    // Play the heart animation
    try {
      lottieRef.current?.reset();
      lottieRef.current?.play();
    } catch {}

    // Nice pulse (doesn't block the press)
    scale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 14, stiffness: 180 }),
    );

    // Trigger the real action slightly after so user sees the animation
    setTimeout(onPress, delayBeforeActionMs);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={12}
      style={[
        aStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: border ?? 'transparent',
          borderWidth: border ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
      ]}
    >
      <LottieView
        ref={lottieRef}
        source={source}
        style={{ width: lottieSize, height: lottieSize }}
        autoPlay={false}
        loop={false}
        // when the animation ends, go back to the outline
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            requestAnimationFrame(() => lottieRef.current?.reset());
          }
        }}
        renderMode="HARDWARE"
      />
    </AnimatedPressable>
  );
}
