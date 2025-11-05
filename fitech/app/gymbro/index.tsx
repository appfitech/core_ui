import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { MATCH_SCREEN_TABS } from '@/constants/screens';
import { useTheme } from '@/contexts/ThemeContext';
import { GymBroCandidateResponseDto } from '@/types/api/types.gen';
import { MatchScreenTab } from '@/types/forms';
import { FullTheme } from '@/types/theme';

import {
  useDiscardGymBro,
  useMatchGymBro,
} from '../api/mutations/matches/use-match-action';
import {
  useGetGymBroCandidates,
  useGetGymBroMutuals,
} from '../api/queries/matches/use-get-gymbro-list';
import { MatchButtonSection } from '../components/MatchButtonSection';
import { MatchContactCard } from '../components/MatchContactCard';
import { MatchProfileCard } from '../components/MatchProfileCard';
import { Tabs } from '../components/Tabs';
import { showMatchToast } from '../components/Toast';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.9;
const CARD_H = Math.min(320, SCREEN_H * 0.45);
const SWIPE_THRESHOLD = CARD_W * 0.35;

export default function GymBroScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: candidates, refetch: refetchCandidates } =
    useGetGymBroCandidates();
  const { data: mutuals, refetch: refetchMutuals } = useGetGymBroMutuals();
  const { mutate: discardGymBro } = useDiscardGymBro();
  const { mutate: matchGymBro } = useMatchGymBro();

  const [savedMap, setSavedMap] = useState<
    Record<string, GymBroCandidateResponseDto>
  >({});
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(new Set());

  const available = useMemo(() => {
    return (
      candidates?.filter((candidate) => {
        const id = String(candidate?.userId);

        return !savedMap[id] && !discardedIds.has(id);
      }) ?? []
    );
  }, [candidates, savedMap, discardedIds]);

  const [index, setIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<MatchScreenTab>('discover');

  const current = available[index];

  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const resetCard = () => {
    translateX.value = withSpring(0);
    rotation.value = withSpring(0);
  };

  const onSwiped = useCallback(
    (dir: 'left' | 'right') => {
      if (!current?.userId) {
        return;
      }

      const idStr = String(current.userId);

      if (dir === 'right') {
        setSavedMap((prev) => ({ ...prev, [idStr]: current }));

        matchGymBro(current.userId, {
          onSuccess: (response) => {
            refetchMutuals();

            if (response.hasMatch) {
              showMatchToast({
                type: 'gymbro',
                name: response?.matchedUserName ?? '',
              });
            }
          },
        });
      } else {
        setDiscardedIds((prev) => new Set(prev).add(idStr));

        discardGymBro(current.userId, {
          onSuccess: () => {
            refetchMutuals();
          },
        });
      }

      setIndex((prev) => Math.min(prev + 1, Math.max(available.length - 1, 0)));
      resetCard();
    },
    [current, available.length, matchGymBro, discardGymBro],
  );

  const handleRefetchAll = () => {
    refetchMutuals();
    refetchCandidates();
  };

  const handleRemoveMatch = useCallback((targetUserId: number | undefined) => {
    if (!targetUserId) {
      return;
    }

    const id = String(targetUserId);

    setSavedMap((prev) => {
      const next = { ...prev };

      delete next[id];

      return next;
    });

    setDiscardedIds((prev) => new Set(prev).add(id));

    discardGymBro(targetUserId, {
      onSuccess: () => {
        handleRefetchAll();
      },
    });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePass = () => onSwiped('left');
  const handleSave = () => onSwiped('right');

  const savedList = useMemo(() => {
    return Object.values(savedMap).filter((it) => {
      const id = String(it.userId);

      return !discardedIds.has(id);
    });
  }, [savedMap, discardedIds]);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    // .failOffsetY([-10, 10])
    .onUpdate((e) => {
      'worklet';
      translateX.value = e.translationX;
      rotation.value = e.translationX / 18;
    })
    .onEnd((e) => {
      'worklet';
      const shouldRight = e.translationX > SWIPE_THRESHOLD;
      const shouldLeft = e.translationX < -SWIPE_THRESHOLD;

      if (shouldLeft || shouldRight) {
        const toX = (shouldRight ? SCREEN_W : -SCREEN_W) * 1.2;
        translateX.value = withTiming(
          toX,
          { duration: 220, easing: Easing.out(Easing.quad) },
          () => runOnJS(onSwiped)(shouldRight ? 'right' : 'left'),
        );
        return;
      }

      translateX.value = withSpring(0);
      rotation.value = withSpring(0);
    });

  return (
    <PageContainer
      header={'GymBro'}
      subheader={
        'Tu dupla de entrenamiento te espera. Entrena acompañado y llega más lejos.'
      }
      style={{ flex: 1, paddingBottom: 0 }}
    >
      <SafeAreaView style={{ flex: 1, rowGap: 20, marginTop: 10 }}>
        <Tabs
          options={MATCH_SCREEN_TABS}
          value={selectedTab}
          onSelect={setSelectedTab}
        />

        <View style={{}}>
          {selectedTab === 'discover' ? (
            <View style={[styles.center, { paddingBottom: 140 }]}>
              {current ? (
                <GestureDetector gesture={pan}>
                  <Animated.View style={[cardStyle]}>
                    <MatchProfileCard candidate={current} />
                  </Animated.View>
                </GestureDetector>
              ) : (
                <View
                  style={[
                    styles.empty,
                    {
                      width: CARD_W,
                      height: CARD_H,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <AppText style={styles.emptyText}>
                    No hay más perfiles por ahora ✨
                  </AppText>
                </View>
              )}
            </View>
          ) : (
            <FlatList
              data={mutuals}
              keyExtractor={(item) => String(item.userId)}
              contentContainerStyle={{
                gap: 12,
                paddingBottom: 24,
              }}
              renderItem={({ item }) => (
                <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
                  <MatchContactCard
                    candidate={item}
                    onDiscard={() => handleRemoveMatch(item?.userId)}
                    onContact={() => {}}
                  />
                </Animated.View>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 50,
                    alignItems: 'center',
                  }}
                >
                  <AppText style={styles.emptyText}>
                    Nada por aquí… Ve a “Descubre” y desliza ➡️. Si hacen match
                    (like mutuo), te llega notificación.
                  </AppText>
                </View>
              }
            />
          )}
        </View>

        {selectedTab === 'discover' && (
          <MatchButtonSection
            onDiscard={handlePass}
            onMatch={handleSave}
            type="gymbro"
            hideRefresh={!!current}
            onRefresh={handleRefetchAll}
          />
        )}
      </SafeAreaView>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: {
      borderWidth: 1,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: 500,
      textAlign: 'center',
    },
  });
