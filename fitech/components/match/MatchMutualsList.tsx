import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { MatchContactCard } from '@/components/MatchContactCard';
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
};

export function MatchMutualsList({
  mutuals,
  onDiscard,
  emptyTitle,
  emptyHint,
}: Props) {
  return (
    <FlatList
      style={styles.list}
      data={mutuals}
      keyExtractor={(item) => String(item.userId)}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <MatchContactCard
            candidate={item}
            onDiscard={() => onDiscard(item?.userId)}
          />
        </Animated.View>
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
  list: { flex: 1 },
  content: {
    gap: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
