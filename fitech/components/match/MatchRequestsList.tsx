import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import { MatchRequestItem } from '@/lib/api/queries/matches/use-get-match-requests';
import { MatchScreenType } from '@/types/forms';

import { MatchRequestCard } from './MatchRequestCard';

type Props = {
  requests: MatchRequestItem[] | undefined;
  type: MatchScreenType;
  onMatch: (userId: number | undefined) => void;
  onPass: (userId: number | undefined) => void;
  emptyTitle: string;
  emptyHint: string;
};

export function MatchRequestsList({
  requests,
  type,
  onMatch,
  onPass,
  emptyTitle,
  emptyHint,
}: Props) {
  return (
    <FlatList
      style={styles.list}
      data={requests ?? []}
      keyExtractor={(item) => String(item.userId)}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View>
          <MatchRequestCard
            request={item}
            type={type}
            onMatch={() => onMatch(item.userId)}
            onPass={() => onPass(item.userId)}
          />
        </View>
      )}
      ListEmptyComponent={
        <ListEmptyState
          icon={type === 'gymbro' ? 'barbell-outline' : 'heart-outline'}
          title={emptyTitle}
          hint={emptyHint}
        />
      }
      removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
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
