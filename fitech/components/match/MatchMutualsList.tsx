import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { MatchContactCard } from '@/components/MatchContactCard';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import {
  GymBroCandidateResponseDto,
  GymCrushCandidateResponseDto,
} from '@/types/api/types.gen';

type Mutual = GymBroCandidateResponseDto | GymCrushCandidateResponseDto;

type Props = {
  mutuals: Mutual[] | undefined;
  onDiscard: (userId: number | undefined) => void;
  emptyTitle: string;
  emptyHint: string;
  refreshControl?: React.ReactElement<React.ComponentProps<typeof RefreshControl>>;
};

export function MatchMutualsList({
  mutuals,
  onDiscard,
  emptyTitle,
  emptyHint,
  refreshControl,
}: Props) {
  return (
    <FlatList
      style={LIST_SCREEN_FLATLIST.listStyle}
      overScrollMode={LIST_SCREEN_FLATLIST.overScrollMode}
      data={mutuals ?? []}
      keyExtractor={(item) => String(item.userId)}
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
      renderItem={({ item }) => (
        <View>
          <MatchContactCard
            candidate={item}
            onDiscard={() => onDiscard(item?.userId)}
          />
        </View>
      )}
      ListEmptyComponent={
        <ListEmptyState
          icon="heart-outline"
          title={emptyTitle}
          hint={emptyHint}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
