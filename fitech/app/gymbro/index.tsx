import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MatchCelebrationModal } from '@/components/match/MatchCelebrationModal';
import { MatchDiscoverDeck } from '@/components/match/MatchDiscoverDeck';
import { MatchMutualsList } from '@/components/match/MatchMutualsList';
import { MatchButtonSection } from '@/components/MatchButtonSection';
import PageContainer from '@/components/PageContainer';
import { Tabs } from '@/components/Tabs';
import { MATCH_SCREEN_TABS } from '@/constants/screens';
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
import {
  buildMatchCelebrationFromResponse,
  MatchCelebrationPayload,
} from '@/utils/match-celebration';
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
  const [celebration, setCelebration] =
    useState<MatchCelebrationPayload | null>(null);

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
            const payload = buildMatchCelebrationFromResponse(
              'gymbro',
              response,
            );
            if (payload) {
              setCelebration(payload);
              void refetchMutuals();
            }
          },
        });
      } else {
        discardGymBro(targetUserId);
      }
    },
    [current, removeCurrent, matchGymBro, discardGymBro, refetchMutuals],
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

      <MatchCelebrationModal
        celebration={celebration}
        onDismiss={() => setCelebration(null)}
        onViewMatches={() => setSelectedTab('matches')}
      />
    </PageContainer>
  );
}

const getStyles = (_theme: AppTheme) =>
  StyleSheet.create({
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
  });
