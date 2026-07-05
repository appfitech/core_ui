import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { MatchRequestCandidate } from '@/lib/api/queries/matches/use-get-match-requests';
import { MatchScreenType } from '@/types/forms';

import { MatchRequestCard } from './MatchRequestCard';

type Props = {
  requests: MatchRequestCandidate[] | undefined;
  type: MatchScreenType;
  onMatch: (userId: number | undefined) => void;
  onPass: (userId: number | undefined) => void;
  emptyTitle: string;
  emptyHint: string;
  refreshControl?: React.ReactElement<React.ComponentProps<typeof RefreshControl>>;
};

export function MatchRequestsList({
  requests,
  type,
  onMatch,
  onPass,
  emptyTitle,
  emptyHint,
  refreshControl,
}: Props) {
  return (
    <FlatList
      style={styles.list}
      overScrollMode="always"
      data={requests}
      keyExtractor={(item) => String(item.userId)}
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
      renderItem={({ item }) => (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <MatchRequestCard
            candidate={item}
            type={type}
            onMatch={() => onMatch(item.userId)}
            onPass={() => onPass(item.userId)}
          />
        </Animated.View>
      )}
      ListEmptyComponent={
        <ListEmptyState
          icon={type === 'gymbro' ? 'barbell-outline' : 'heart-outline'}
          title={emptyTitle}
          hint={emptyHint}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    gap: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
