import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { MatchRequestItem } from '@/lib/api/queries/matches/use-get-match-requests';
import { MatchScreenType } from '@/types/forms';
import { AppTheme } from '@/types/theme';

const PHOTO_WIDTH = 96;
const PHOTO_HEIGHT = 120;

type Props = {
  request: MatchRequestItem;
  type: MatchScreenType;
  onMatch: () => void;
  onPass: () => void;
};

export function MatchRequestCard({ request, type, onMatch, onPass }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const matchIcon =
    type === 'gymbro' ? ('barbell' as const) : ('heart' as const);
  const matchLabel =
    type === 'gymbro' ? 'Aceptar solicitud GymBro' : 'Aceptar solicitud GymCrush';

  return (
    <View style={styles.card}>
      <View style={styles.photoWrap}>
        <View style={styles.photoPlaceholder}>
          <Ionicons name="person" size={36} color={theme.text.tertiary} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.nameBlock}>
            {request.name ? (
              <AppText style={styles.nameText} numberOfLines={2}>
                {request.name}
              </AppText>
            ) : null}
            {request.email ? (
              <AppText style={styles.emailText} numberOfLines={1}>
                {request.email}
              </AppText>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onMatch}
              accessibilityRole="button"
              accessibilityLabel={matchLabel}
              style={({ pressed }) => [
                styles.actionButton,
                type === 'gymbro' ? styles.matchButtonGymBro : styles.matchButtonGymCrush,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons
                name={matchIcon}
                size={20}
                color={theme.background.app}
              />
            </Pressable>

            <Pressable
              onPress={onPass}
              accessibilityRole="button"
              accessibilityLabel="Rechazar solicitud"
              style={({ pressed }) => [
                styles.actionButton,
                styles.passButton,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme.status.error.icon}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'stretch',
      columnGap: 12,
      padding: 12,
      minHeight: PHOTO_HEIGHT + 24,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    photoWrap: {
      width: PHOTO_WIDTH,
      height: PHOTO_HEIGHT,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.background.input,
    },
    photoPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.input,
    },
    body: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 8,
    },
    nameBlock: {
      flex: 1,
      rowGap: 4,
    },
    nameText: {
      ...text.leadSemibold,
      color: theme.text.primary,
    },
    emailText: {
      ...text.small,
      color: theme.text.secondary,
    },
    actions: {
      flexDirection: 'row',
      columnGap: 6,
      flexShrink: 0,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    matchButtonGymBro: {
      backgroundColor: theme.brand.primary,
    },
    matchButtonGymCrush: {
      backgroundColor: '#ff3b30',
    },
    passButton: {
      backgroundColor: theme.status.error.bg,
      borderWidth: 1,
      borderColor: theme.status.error.border,
    },
    actionPressed: {
      opacity: 0.88,
    },
  });
};
