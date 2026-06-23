import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type ConfirmVariant = 'destructive' | 'primary';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  intro: string;
  bullets?: string[];
  body?: string;
  warning: string;
  dismissLabel: string;
  confirmLabel: string;
  confirmVariant?: ConfirmVariant;
  confirmLoading?: boolean;
  confirmLoadingLabel?: string;
  dismissDisabled?: boolean;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
};

export function ContractConfirmSheet({
  visible,
  onClose,
  onConfirm,
  title,
  intro,
  bullets,
  body,
  warning,
  dismissLabel,
  confirmLabel,
  confirmVariant = 'primary',
  confirmLoading = false,
  confirmLoadingLabel,
  dismissDisabled = false,
  confirmDisabled = false,
  children,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets.bottom);

  const handleConfirm = () => {
    if (confirmLoading || confirmDisabled) return;
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <KeyboardAwareScrollView
              enableOnAndroid
              enableAutomaticScroll
              enableResetScrollToCoords={false}
              keyboardOpeningTime={0}
              extraScrollHeight={Platform.OS === 'ios' ? 16 : 24}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.handle} />

              <AppText style={styles.title}>{title}</AppText>
              <AppText style={styles.intro}>{intro}</AppText>

              {body ? <AppText style={styles.body}>{body}</AppText> : null}

              {bullets?.length ? (
                <View style={styles.bulletList}>
                  {bullets.map((item) => (
                    <View key={item} style={styles.bulletRow}>
                      <AppText style={styles.bulletMarker}>•</AppText>
                      <AppText style={styles.bulletText}>{item}</AppText>
                    </View>
                  ))}
                </View>
              ) : null}

              {children}

              <View style={styles.warningPill}>
                <AppText style={styles.warningText}>{warning}</AppText>
              </View>

              <View style={styles.actions}>
                <Button
                  type="secondary"
                  label={dismissLabel}
                  onPress={onClose}
                  disabled={dismissDisabled || confirmLoading}
                  animated={false}
                  style={styles.actionButton}
                />
                <Button
                  type={
                    confirmVariant === 'destructive' ? 'destructive' : 'primary'
                  }
                  label={confirmLabel}
                  onPress={handleConfirm}
                  disabled={confirmLoading || confirmDisabled}
                  loading={confirmLoading}
                  loadingLabel={confirmLoadingLabel}
                  animated={false}
                  style={styles.actionButton}
                />
              </View>
            </KeyboardAwareScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const getStyles = (theme: AppTheme, safeBottom: number) => {
  const text = textStyles(theme);
  const sheetBottom = Math.max(safeBottom, 16) + 20;

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    keyboardView: {
      width: '100%',
      maxHeight: '92%',
    },
    sheet: {
      backgroundColor: theme.background.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.border.default,
      maxHeight: '100%',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: sheetBottom,
      rowGap: 10,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border.default,
      marginBottom: 4,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    intro: {
      ...text.smallMedium,
      color: theme.text.primary,
      textAlign: 'center',
      lineHeight: 20,
    },
    body: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    bulletList: {
      rowGap: 6,
      paddingHorizontal: 4,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 8,
    },
    bulletMarker: {
      ...text.small,
      color: theme.text.tertiary,
      lineHeight: 20,
    },
    bulletText: {
      ...text.small,
      flex: 1,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    warningPill: {
      alignSelf: 'center',
      backgroundColor: theme.status.warning.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginTop: 2,
    },
    warningText: {
      ...text.captionSemibold,
      color: theme.status.warning.text,
    },
    actions: {
      flexDirection: 'row',
      columnGap: 10,
      marginTop: 8,
    },
    actionButton: {
      flex: 1,
    },
  });
};
