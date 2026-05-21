import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ConfettiAnimation from '@/assets/lottie/confetti.json';
import { AppText } from '@/components/AppText';
import { MatchDiscoverDeck } from '@/components/match/MatchDiscoverDeck';
import { MatchMutualsList } from '@/components/match/MatchMutualsList';
import { MatchButtonSection } from '@/components/MatchButtonSection';
import PageContainer from '@/components/PageContainer';
import { Tabs } from '@/components/Tabs';
import { showMatchToast } from '@/components/Toast';
import { MATCH_SCREEN_TABS } from '@/constants/screens';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useMatchDiscoverQueue } from '@/hooks/use-match-discover-queue';
import {
  useDiscardGymCrush,
  useMatchGymCrush,
} from '@/lib/api/mutations/matches/use-match-action';
import {
  useGetGymCrushCandidates,
  useGetGymCrushMutuals,
} from '@/lib/api/queries/matches/use-get-gymcrush-list';
import { MatchScreenTab } from '@/types/forms';
import { AppTheme } from '@/types/theme';
import { prefetchMatchProfileImage } from '@/utils/match-profile-image-cache';
import { getCandidateProfileImageUrl } from '@/utils/user';

const DISCOVER_EMPTY = {
  title: 'No hay más perfiles por ahora ✨',
  hint: 'Vuelve más tarde o actualiza la lista.',
};

const MUTUALS_EMPTY = {
  title: 'Aún no tienes GymCrushes',
  hint: 'Ve a “Descubre” y desliza a la derecha ❤️. Si hay like mutuo, te llega una notificación.',
};

export default function GymCrushScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: candidates, refetch: refetchCandidates } =
    useGetGymCrushCandidates();
  const { data: mutuals, refetch: refetchMutuals } = useGetGymCrushMutuals();
  const { mutate: discardGymCrush } = useDiscardGymCrush();
  const { mutate: matchGymCrush } = useMatchGymCrush();

  const { current, next, removeCurrent, resetQueue } =
    useMatchDiscoverQueue(candidates);

  const [selectedTab, setSelectedTab] = useState<MatchScreenTab>('discover');
  const [matchName, setMatchName] = useState<string | null>(null);

  useEffect(() => {
    for (const candidate of [current, next]) {
      const uri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);
      void prefetchMatchProfileImage(uri);
    }
  }, [current, next]);

  const handleRefetchAll = useCallback(() => {
    resetQueue();
    refetchMutuals();
    refetchCandidates();
  }, [resetQueue, refetchMutuals, refetchCandidates]);

  const onSwiped = useCallback(
    (dir: 'left' | 'right') => {
      if (!current?.userId) return;

      const targetUserId = current.userId;
      removeCurrent(dir);

      if (dir === 'right') {
        matchGymCrush(targetUserId, {
          onSuccess: (response) => {
            if (response.hasMatch) {
              showMatchToast({
                type: 'gymcrush',
                name: response?.matchedUserName ?? '',
              });
              setMatchName(response?.matchedUserName ?? '');
              setTimeout(() => setMatchName(null), 2500);
            }
          },
        });
      } else {
        discardGymCrush(targetUserId);
      }
    },
    [current, removeCurrent, matchGymCrush, discardGymCrush],
  );

  const handleRemoveMatch = useCallback(
    (targetUserId: number | undefined) => {
      if (!targetUserId) return;

      discardGymCrush(targetUserId, {
        onSuccess: () => {
          handleRefetchAll();
        },
      });
    },
    [discardGymCrush, handleRefetchAll],
  );

  return (
    <PageContainer
      title="GymCrush"
      subheader="Conecta con tu crush fitness. Coincidan, queden y vean si hay química."
      style={styles.pageContainer}
      disableScroll
      hasBottomPadding={false}
    >
      <View style={styles.root}>
        <Tabs
          options={MATCH_SCREEN_TABS}
          value={selectedTab}
          onSelect={setSelectedTab}
        />

        <View style={styles.content}>
          {selectedTab === 'discover' ? (
            <MatchDiscoverDeck
              current={current}
              next={next}
              onSwiped={onSwiped}
              emptyTitle={DISCOVER_EMPTY.title}
              emptyHint={DISCOVER_EMPTY.hint}
            />
          ) : (
            <MatchMutualsList
              mutuals={mutuals}
              onDiscard={handleRemoveMatch}
              emptyTitle={MUTUALS_EMPTY.title}
              emptyHint={MUTUALS_EMPTY.hint}
            />
          )}
        </View>

        {selectedTab === 'discover' && (
          <MatchButtonSection
            onDiscard={() => onSwiped('left')}
            onMatch={() => onSwiped('right')}
            type="gymcrush"
            hideRefresh={!!current}
            onRefresh={handleRefetchAll}
          />
        )}
      </View>

      {matchName ? (
        <View style={styles.matchOverlay} pointerEvents="none">
          <LottieView
            source={ConfettiAnimation}
            autoPlay
            loop
            style={styles.matchLottie}
          />
          <View style={styles.matchTextContainer}>
            <AppText style={styles.matchTitle}>¡Es un match! 💚</AppText>
            <AppText style={styles.matchSubtitle}>
              Tú y {matchName} ahora son GymCrushes.
            </AppText>
          </View>
        </View>
      ) : null}
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageContainer: { paddingBottom: 0 },
    root: {
      flex: 1,
      rowGap: 12,
      marginTop: 10,
      minHeight: 480,
    },
    content: {
      flex: 1,
      paddingBottom: 120,
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
