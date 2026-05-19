import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
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

import ConfettiAnimation from '@/assets/lottie/confetti.json';
import { textStyles } from '@/constants/styles';
import { AppText } from '@/components/AppText';
import { MatchButtonSection } from '@/components/MatchButtonSection';
import { MatchContactCard } from '@/components/MatchContactCard';
import { MatchProfileCard } from '@/components/MatchProfileCard';
import PageContainer from '@/components/PageContainer';
import { Tabs } from '@/components/Tabs';
import { showMatchToast } from '@/components/Toast';
import { MATCH_SCREEN_TABS } from '@/constants/screens';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useDiscardGymBro,
  useMatchGymBro,
} from '@/lib/api/mutations/matches/use-match-action';
import {
  useGetGymBroCandidates,
  useGetGymBroMutuals,
} from '@/lib/api/queries/matches/use-get-gymbro-list';
import { GymBroCandidateResponseDto } from '@/types/api/types.gen';
import { MatchScreenTab } from '@/types/forms';
import { FullTheme } from '@/types/theme';
import { getCandidateProfileImageUrl } from '@/utils/user';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.9;
const CARD_H = Math.min(420, SCREEN_H * 0.55);
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

  useEffect(() => {
    const PREFETCH_AHEAD = 4;
    for (let i = Math.max(0, index - 1); i <= index + PREFETCH_AHEAD; i++) {
      const candidate = available[i];
      const uri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);
      if (uri) Image.prefetch(uri);
    }
  }, [index, available]);

  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const [matchName, setMatchName] = useState<string | null>(null);

  const resetCard = useCallback(() => {
    translateX.value = withSpring(0);
    rotation.value = withSpring(0);
  }, [translateX, rotation]);

  const handleRefetchAll = useCallback(() => {
    setIndex(0);
    setDiscardedIds(new Set());
    setSavedMap({});
    refetchMutuals();
    refetchCandidates();
  }, [refetchMutuals, refetchCandidates]);

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

              setMatchName(response?.matchedUserName ?? '');

              setTimeout(() => {
                setMatchName(null);
              }, 2500);
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
    [
      current,
      available.length,
      matchGymBro,
      discardGymBro,
      refetchMutuals,
      resetCard,
    ],
  );

  const handleRemoveMatch = useCallback(
    (targetUserId: number | undefined) => {
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
    },
    [discardGymBro, handleRefetchAll],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePass = () => onSwiped('left');
  const handleSave = () => onSwiped('right');

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
      title="GymBro"
      subheader="Tu dupla de entrenamiento te espera. Entrena acompañado y llega más lejos."
      style={styles.pageContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <Tabs
          options={MATCH_SCREEN_TABS}
          value={selectedTab}
          onSelect={setSelectedTab}
        />

        <View style={styles.contentWrapper}>
          {selectedTab === 'discover' ? (
            <View style={styles.centerWithPadding}>
              {current ? (
                <GestureDetector gesture={pan}>
                  <Animated.View
                    style={[cardStyle]}
                    key={`gymbro-${current.userId}`}
                  >
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
      {matchName && (
        <View style={styles.matchOverlay} pointerEvents="none">
          <LottieView
            source={ConfettiAnimation}
            autoPlay
            loop={true}
            style={styles.matchLottie}
          />
          <View style={styles.matchTextContainer}>
            <AppText style={styles.matchTitle}>¡Es un match! 💚</AppText>
            <AppText style={styles.matchSubtitle}>
              Tú y {matchName} ahora son GymBros.
            </AppText>
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageContainer: { paddingBottom: 0 },
    safeArea: {
      flex: 1,
      minHeight: SCREEN_H - 120,
      rowGap: 12,
      marginTop: 10,
    },
    contentWrapper: { flex: 1, minHeight: CARD_H + 280 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    centerWithPadding: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 16,
      paddingBottom: 220,
      minHeight: SCREEN_H * 0.6,
    },
    empty: {
      borderWidth: 1,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyCard: {
      width: CARD_W,
      height: CARD_H,
      borderColor: theme.border,
    },
    listContent: { gap: 12, paddingBottom: 24 },
    listEmptyWrapper: {
      paddingHorizontal: 24,
      paddingVertical: 50,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.textSecondary,
      ...text.bodyMedium,
      textAlign: 'center',
    },

    matchOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    matchLottie: {
      width: 260,
      height: 260,
    },
    matchTextContainer: {
      position: 'absolute',
      bottom: '18%',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    matchTitle: {
      ...text.sectionTitle,
      color: '#fff',
      textAlign: 'center',
      marginBottom: 4,
    },
    matchSubtitle: {
      ...text.smallMedium,
      color: '#fff',
      textAlign: 'center',
    },
  });
};
