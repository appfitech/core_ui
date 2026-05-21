import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { MatchProfileCard } from '@/components/MatchProfileCard';
import { MATCH_CARD_HEIGHT, MATCH_CARD_WIDTH } from '@/constants/match-layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useMatchSwipeGesture } from '@/hooks/use-match-swipe-gesture';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Candidate = GymBroCandidateResponseDto | GymCrushCandidateResponseDto;

type Props = {
  current: Candidate | undefined;
  next: Candidate | undefined;
  onSwiped: (direction: 'left' | 'right') => void;
  emptyTitle: string;
  emptyHint?: string;
};

/**
 * Two fixed slots (A/B) in stable tree positions. Swipe transforms only apply to
 * the front slot; back slot always keeps identity transform (no promote "pop").
 */
export function MatchDiscoverDeck({
  current,
  next,
  onSwiped,
  emptyTitle,
  emptyHint,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [slotA, setSlotA] = useState<Candidate | null>(() => current ?? null);
  const [slotB, setSlotB] = useState<Candidate | null>(() => next ?? null);
  const [frontIsA, setFrontIsA] = useState(true);
  const frontIsAShared = useSharedValue(1);
  const skipSyncRef = useRef(false);

  const { pan, translateX, rotation, resetCardPosition } =
    useMatchSwipeGesture(onSwiped);

  useLayoutEffect(() => {
    const frontId = frontIsA ? slotA?.userId : slotB?.userId;
    const backId = frontIsA ? slotB?.userId : slotA?.userId;

    if (current?.userId === backId && current?.userId !== frontId) {
      skipSyncRef.current = true;
      setFrontIsA((wasA) => {
        frontIsAShared.value = wasA ? 0 : 1;
        if (wasA) setSlotA(next ?? null);
        else setSlotB(next ?? null);
        return !wasA;
      });
      resetCardPosition();
      return;
    }

    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }

    if (current?.userId !== frontId && current?.userId !== backId) {
      setSlotA(current ?? null);
      setSlotB(next ?? null);
      setFrontIsA(true);
      resetCardPosition();
      return;
    }

    if (next?.userId !== backId) {
      if (frontIsA) setSlotB(next ?? null);
      else setSlotA(next ?? null);
    }
  }, [
    current?.userId,
    next?.userId,
    frontIsA,
    slotA?.userId,
    slotB?.userId,
    resetCardPosition,
  ]);

  const slotAStyle = useAnimatedStyle(() => {
    const isFront = frontIsAShared.value === 1;
    return {
      zIndex: isFront ? 2 : 1,
      transform: [
        { translateX: isFront ? translateX.value : 0 },
        { rotate: isFront ? `${rotation.value}deg` : '0deg' },
      ],
    };
  });

  const slotBStyle = useAnimatedStyle(() => {
    const isFront = frontIsAShared.value === 0;
    return {
      zIndex: isFront ? 2 : 1,
      transform: [
        { translateX: isFront ? translateX.value : 0 },
        { rotate: isFront ? `${rotation.value}deg` : '0deg' },
      ],
    };
  });

  const hasAnyCard = Boolean(slotA || slotB);

  if (!hasAnyCard) {
    return (
      <View style={styles.emptyWrap}>
        <View style={[styles.emptyCard, styles.cardFrame]}>
          <ListEmptyState
            icon="people-outline"
            title={emptyTitle}
            hint={emptyHint}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.deck}>
      <GestureDetector gesture={pan}>
        <View style={styles.deckTouchTarget} collapsable={false}>
          {slotA ? (
            <Animated.View
              style={[styles.cardFrame, styles.slot, slotAStyle]}
              collapsable={false}
            >
              <MatchProfileCard slotId="a" candidate={slotA} />
            </Animated.View>
          ) : null}

          {slotB ? (
            <Animated.View
              style={[styles.cardFrame, styles.slot, slotBStyle]}
              collapsable={false}
            >
              <MatchProfileCard slotId="b" candidate={slotB} />
            </Animated.View>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    deck: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 8,
      minHeight: MATCH_CARD_HEIGHT + 24,
    },
    deckTouchTarget: {
      width: MATCH_CARD_WIDTH,
      height: MATCH_CARD_HEIGHT,
    },
    cardFrame: {
      width: MATCH_CARD_WIDTH,
      height: MATCH_CARD_HEIGHT,
    },
    slot: {
      position: 'absolute',
      left: 0,
      top: 0,
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 8,
    },
    emptyCard: {
      borderWidth: 1,
      borderColor: theme.border.default,
      borderRadius: 28,
      backgroundColor: theme.background.card,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
};
