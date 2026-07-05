import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MatchCelebrationModal } from '@/components/match/MatchCelebrationModal';
import { MatchDiscoverDeck } from '@/components/match/MatchDiscoverDeck';
import { MatchMutualsList } from '@/components/match/MatchMutualsList';
import { MatchRequestsList } from '@/components/match/MatchRequestsList';
import { MatchButtonSection } from '@/components/MatchButtonSection';
import PageContainer from '@/components/PageContainer';
import { Tabs } from '@/components/Tabs';
import { MATCH_SCREEN_TABS } from '@/constants/screens';
import { useTheme } from '@/contexts/ThemeContext';
import { useMatchDiscoverQueue } from '@/hooks/use-match-discover-queue';
import { useMatchScreenTab } from '@/hooks/use-match-screen-tab';
import {
  useDiscardGymBro,
  useMatchGymBro,
} from '@/lib/api/mutations/matches/use-match-action';
import {
  useGetGymBroCandidates,
  useGetGymBroMutuals,
} from '@/lib/api/queries/matches/use-get-gymbro-list';
import { useGetMatchRequests } from '@/lib/api/queries/matches/use-get-match-requests';
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

const REQUESTS_EMPTY = {
  title: 'No tienes solicitudes pendientes',
  hint: 'Cuando alguien te dé like, aparecerá aquí para que decidas si haces match.',
};

export default function GymBroScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: candidates, refetch: refetchCandidates } =
    useGetGymBroCandidates();
  const { data: mutuals, refetch: refetchMutuals } = useGetGymBroMutuals();
  const { data: matchRequests, refetch: refetchRequests } =
    useGetMatchRequests('gymbro');
  const { mutate: discardGymBro } = useDiscardGymBro();
  const { mutate: matchGymBro } = useMatchGymBro();

  const { current, next, removeCurrent, resetQueue } =
    useMatchDiscoverQueue(candidates);

  const [selectedTab, setSelectedTab] = useMatchScreenTab();
  const [celebration, setCelebration] =
    useState<MatchCelebrationPayload | null>(null);

  useEffect(() => {
    for (const candidate of [current, next]) {
      const uri = getCandidateProfileImageUrl(candidate?.profilePhotoUrl);
      void prefetchMatchProfileImage(uri);
    }
  }, [current, next]);

  const handleRefetchAll = useCallback(async () => {
    resetQueue();
    await Promise.all([
      refetchMutuals(),
      refetchCandidates(),
      refetchRequests(),
    ]);
  }, [resetQueue, refetchMutuals, refetchCandidates, refetchRequests]);

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
          void handleRefetchAll();
        },
      });
    },
    [discardGymBro, handleRefetchAll],
  );

  const handleMatchRequest = useCallback(
    (targetUserId: number | undefined) => {
      if (!targetUserId) return;

      matchGymBro(targetUserId, {
        onSuccess: (response) => {
          void refetchRequests();
          const payload = buildMatchCelebrationFromResponse('gymbro', response);
          if (payload) {
            setCelebration(payload);
            void refetchMutuals();
          }
        },
      });
    },
    [matchGymBro, refetchMutuals, refetchRequests],
  );

  const handlePassRequest = useCallback(
    (targetUserId: number | undefined) => {
      if (!targetUserId) return;

      discardGymBro(targetUserId, {
        onSuccess: () => {
          void refetchRequests();
        },
      });
    },
    [discardGymBro, refetchRequests],
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
          ) : selectedTab === 'requests' ? (
            <MatchRequestsList
              requests={matchRequests}
              type="gymbro"
              onMatch={handleMatchRequest}
              onPass={handlePassRequest}
              emptyTitle={REQUESTS_EMPTY.title}
              emptyHint={REQUESTS_EMPTY.hint}
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
