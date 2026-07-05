import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RefreshFeedbackBar } from '@/components/RefreshFeedbackBar';

type Props = {
  visible: boolean;
};

/** Sticky “Actualizando…” banner over a FlatList while refreshing. */
export function ListRefreshOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <RefreshFeedbackBar visible />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
