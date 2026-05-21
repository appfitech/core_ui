import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  type SharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MATCH_SWIPE_THRESHOLD } from '@/constants/match-layout';

const SCREEN_W = Dimensions.get('window').width;

type SlotMotion = {
  translateX: SharedValue<number>;
  rotation: SharedValue<number>;
};

type Params = {
  onSwiped: (dir: 'left' | 'right') => void;
  frontIsAShared: SharedValue<number>;
  slotA: SlotMotion;
  slotB: SlotMotion;
};

export function useMatchSwipeGesture({
  onSwiped,
  frontIsAShared,
  slotA,
  slotB,
}: Params) {
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-14, 14])
        .onUpdate((e) => {
          'worklet';
          const motion = frontIsAShared.value === 1 ? slotA : slotB;
          motion.translateX.value = e.translationX;
          motion.rotation.value = e.translationX / 20;
        })
        .onEnd((e) => {
          'worklet';
          const motion = frontIsAShared.value === 1 ? slotA : slotB;
          const shouldRight = e.translationX > MATCH_SWIPE_THRESHOLD;
          const shouldLeft = e.translationX < -MATCH_SWIPE_THRESHOLD;

          if (shouldLeft || shouldRight) {
            const direction = shouldRight ? 'right' : 'left';
            const toX = (shouldRight ? SCREEN_W : -SCREEN_W) * 1.2;
            motion.translateX.value = withTiming(
              toX,
              { duration: 220, easing: Easing.out(Easing.quad) },
              (finished) => {
                if (finished) runOnJS(onSwiped)(direction);
              },
            );
            return;
          }

          motion.translateX.value = withSpring(0);
          motion.rotation.value = withSpring(0);
        }),
    [frontIsAShared, onSwiped, slotA, slotB],
  );

  return { pan };
}
