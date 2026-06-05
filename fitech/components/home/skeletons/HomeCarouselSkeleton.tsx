import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBox } from '@/components/Skeleton';

type Props = {
  cardWidth: number;
  cardHeight: number;
  count?: number;
  gap?: number;
};

export function HomeCarouselSkeleton({
  cardWidth,
  cardHeight,
  count = 2,
  gap = 12,
}: Props) {
  return (
    <View style={[styles.row, { columnGap: gap }]}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBox
          key={`carousel-skeleton-${index}`}
          width={cardWidth}
          height={cardHeight}
          borderRadius={16}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingRight: 4,
  },
});
