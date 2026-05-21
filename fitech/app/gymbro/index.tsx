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
  useDiscardGymBro,
  useMatchGymBro,
} from '@/lib/api/mutations/matches/use-match-action';
import {
  useGetGymBroCandidates,
  useGetGymBroMutuals,
} from '@/lib/api/queries/matches/use-get-gymbro-list';
import { MatchScreenTab } from '@/types/forms';
import { AppTheme } from '@/types/theme';
import { prefetchMatchProfileImage } from '@/utils/match-profile-image-cache';
import { getCandidateProfileImageUrl } from '@/utils/user';

const DISCOVER_EMPTY = {
  title: 'No hay más perfiles por ahora ✨',
  hint: 'Vuelve más tarde o actualiza la lista.',
};

const MUTUALS_EMPTY = {
  title: 'Aún no tienes GymBros',
  hint: 'Ve a “Descubre” y desliza a la derecha 💪. Si hay like mutuo, te llega una notificación.',
};

export default function GymBroScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: candidates, refetch: refetchCandidates } =
    useGetGymBroCandidates();
  const { data: mutuals, refetch: refetchMutuals } = useGetGymBroMutuals();
  const { mutate: discardGymBro } = useDiscardGymBro();
  const { mutate: matchGymBro } = useMatchGymBro();

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
        matchGymBro(targetUserId, {
          onSuccess: (response) => {
            if (response.hasMatch) {
              showMatchToast({
                type: 'gymbro',
                name: response?.matchedUserName ?? '',
              });
              setMatchName(response?.matchedUserName ?? '');
              setTimeout(() => setMatchName(null), 2500);
            }
          },
        });
      } else {
        discardGymBro(targetUserId);
      }
    },
    [current, removeCurrent, matchGymBro, discardGymBro],
  );

  const handleRemoveMatch = useCallback(
    (targetUserId: number | undefined) => {
      if (!targetUserId) return;

      discardGymBro(targetUserId, {
        onSuccess: () => {
          handleRefetchAll();
        },
      });
    },
    [discardGymBro, handleRefetchAll],
  );

  return (
    <PageContainer
      title="GymBro"
      subheader="Tu dupla de entrenamiento te espera. Entrena acompañado y llega más lejos."
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
            type="gymbro"
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
              Tú y {matchName} ahora son GymBros.
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
