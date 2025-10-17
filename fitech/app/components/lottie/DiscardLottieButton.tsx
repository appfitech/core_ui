import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
  onPress: () => void;
  size?: number; // outer touch area (circle)
  lottieSize?: number; // base Lottie box; defaults to size
  visualScale?: number; // EXTRA scale to compensate comp padding
  offsetX?: number; // nudge if asset is off-center
  offsetY?: number;
  delayBeforeActionMs?: number;
  source?: any; // require('discard.json')
  playSegment?: [number, number]; // frame range to play
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  hitSlop?:
    | number
    | { top: number; bottom: number; left: number; right: number };
};

export default function DiscardLottieButton({
  onPress,
  size = 72,
  lottieSize,
  visualScale = 1.22, // <-- key: enlarge content ~20–25%
  offsetX = 0,
  offsetY = 0,
  delayBeforeActionMs = 260,
  source = require('@/assets/lottie/discard.json'),
  playSegment = [0, 60],
  iconName = 'close',
  iconColor = '#fff',
  iconSize = 24,
  hitSlop = 12,
}: Props) {
  const scale = useSharedValue(1);
  const lottieRef = useRef<LottieView>(null);
  const [showIcon, setShowIcon] = useState(true);
  const box = lottieSize ?? size;

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: 80 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };
  const handlePress = () => {
    setShowIcon(false);
    try {
      lottieRef.current?.reset();
      // @ts-ignore segment play works at runtime
      lottieRef.current?.play(playSegment[0], playSegment[1]);
    } catch {}

    scale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 14, stiffness: 180 }),
    );

    setTimeout(onPress, delayBeforeActionMs);

    const snapBackAfter = Math.max(450, delayBeforeActionMs + 120);
    setTimeout(() => {
      lottieRef.current?.reset();
      setShowIcon(true);
    }, snapBackAfter);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={hitSlop}
      style={[
        btnStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'transparent', // show Lottie's own grey/red disc
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
        style={{
          width: box,
          height: box,
          transform: [
            { translateX: offsetX },
            { translateY: offsetY },
            { scale: visualScale }, // <-- enlarge the rendered content
          ],
        }}
        autoPlay={false}
        loop={false}
        onAnimationFinish={() => {
          lottieRef.current?.reset();
          setShowIcon(true);
        }}
        renderMode="HARDWARE"
      />

      {showIcon && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          pointerEvents="none"
        >
          <Ionicons name={iconName} size={iconSize} color={iconColor} />
        </View>
      )}
    </AnimatedPressable>
  );
}
