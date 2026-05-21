import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MATCH_SWIPE_THRESHOLD } from '@/constants/match-layout';

const SCREEN_W = Dimensions.get('window').width;

export function useMatchSwipeGesture(onSwiped: (dir: 'left' | 'right') => void) {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const resetCardPosition = useCallback(() => {
    cancelAnimation(translateX);
    cancelAnimation(rotation);
    translateX.value = 0;
    rotation.value = 0;
  }, [rotation, translateX]);

  const pan = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .onUpdate((e) => {
      'worklet';
      translateX.value = e.translationX;
      rotation.value = e.translationX / 20;
    })
    .onEnd((e) => {
      'worklet';
      const shouldRight = e.translationX > MATCH_SWIPE_THRESHOLD;
      const shouldLeft = e.translationX < -MATCH_SWIPE_THRESHOLD;

      if (shouldLeft || shouldRight) {
        const direction = shouldRight ? 'right' : 'left';
        const toX = (shouldRight ? SCREEN_W : -SCREEN_W) * 1.2;
        translateX.value = withTiming(
          toX,
          { duration: 220, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (!finished) return;
            translateX.value = 0;
            rotation.value = 0;
            runOnJS(onSwiped)(direction);
          },
        );
        return;
      }

      translateX.value = withSpring(0);
      rotation.value = withSpring(0);
    });

  return { pan, translateX, rotation, resetCardPosition };
}
