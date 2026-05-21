import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Button } from '@/components/Button';

type Props = {
  /** Row: cancel left, primary right. Column: primary top, cancel bottom. */
  layout?: 'row' | 'column';
  primaryLabel: string;
  onPrimary: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  cancelDisabled?: boolean;
  /** Shown above the buttons (e.g. terms checkbox). */
  header?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Standard footer button layout:
 * - row: Cancelar (tertiary) left · primary action right
 * - column: primary action top · Cancelar (tertiary) bottom
 */
export function FooterActions({
  layout = 'row',
  primaryLabel,
  onPrimary,
  cancelLabel = 'Cancelar',
  onCancel,
  primaryDisabled = false,
  primaryLoading = false,
  cancelDisabled = false,
  header,
  style,
}: Props) {
  const isRow = layout === 'row';

  const cancelButton =
    onCancel != null ? (
      <Button
        type="tertiary"
        label={cancelLabel}
        onPress={onCancel}
        disabled={cancelDisabled || primaryLoading}
        animated={false}
        style={isRow ? styles.buttonRow : styles.buttonColumn}
      />
    ) : null;

  const primaryButton = (
    <Button
      label={primaryLabel}
      onPress={onPrimary}
      disabled={primaryDisabled}
      loading={primaryLoading}
      animated={false}
      style={isRow ? styles.buttonRow : styles.buttonColumn}
    />
  );

  return (
    <View style={[styles.wrap, style]}>
      {header}
      <View style={isRow ? styles.actionsRow : styles.actionsColumn}>
        {isRow ? (
          <>
            {cancelButton}
            {primaryButton}
          </>
        ) : (
          <>
            {primaryButton}
            {cancelButton}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    rowGap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  actionsColumn: {
    flexDirection: 'column',
    rowGap: 12,
    width: '100%',
  },
  buttonRow: {
    flex: 1,
  },
  buttonColumn: {
    width: '100%',
  },
});
