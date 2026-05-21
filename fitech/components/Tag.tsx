import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  icon?: string;
  backgroundColor: string;
  textColor: string;
  label: string;
  style?: StyleProp<ViewStyle>;
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

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: theme.status.warning.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      columnGap: 4,
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    text: {
      ...text.smallSemibold,
      flexShrink: 0,
      color: theme.status.warning.text,
    },
  });
};
