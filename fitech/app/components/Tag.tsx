import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  icon?: string;
  backgroundColor: string;
  textColor: string;
  label: string;
};

export function Tag({ backgroundColor, icon = '', label, textColor }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.tagContainer, { backgroundColor }]}>
      {icon && <Feather name={icon} size={16} color={textColor} />}
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
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
