import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

/** Map API icon names (e.g. fitness_center, directions_run) to Ionicons. */
function mapGoalIconToIonicon(icon: string): keyof typeof Ionicons.glyphMap {
  const lower = (icon ?? '').toLowerCase().replace(/_/g, '-');
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    'fitness-center': 'barbell-outline',
    fitness: 'barbell-outline',
    'directions-run': 'walk-outline',
    run: 'walk-outline',
    'local-fire-department': 'flame-outline',
    'fitness-center-outline': 'barbell-outline',
    nutrition: 'nutrition-outline',
    diet: 'nutrition-outline',
    weight: 'barbell-outline',
    muscle: 'body-outline',
    heart: 'heart-outline',
    'heart-pulse': 'heart-outline',
  };
  return map[lower] ?? 'barbell-outline';
}

export function SelectableCard({
  icon,
  title,
  description,
  selected,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const iconName = mapGoalIconToIonicon(icon);

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={26} color={theme.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryBg ?? theme.green100,
    },
    iconWrapper: {
      marginRight: 14,
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      marginRight: 12,
      minWidth: 0,
    },
    title: {
      fontWeight: '700',
      fontSize: 16,
      color: theme.textPrimary,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
      lineHeight: 20,
    },
  });
