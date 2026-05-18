import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  icon?: string;
  backgroundColor: string;
  textColor: string;
  label: string;
  style: StyleProp<ViewStyle>;
};

export function Tag({
  backgroundColor,
  icon = '',
  label,
  textColor,
  style,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.tagContainer, { backgroundColor }, style]}>
      {icon && <Ionicons name={icon as any} size={16} color={textColor} />}
      <AppText style={[styles.text, { color: textColor }]}>{label}</AppText>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.warningBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      columnGap: 4,
      alignSelf: 'flex-start',
    },
    text: {
      color: theme.warningText,
      fontWeight: '600',
      fontSize: 14,
    },
  });
