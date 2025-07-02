import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = { shouldHideEndIcon?: boolean } & TextInputProps;

export function SearchBar({
  onPress,
  onChangeText,
  readOnly,
  placeholder,
  shouldHideEndIcon = false,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={20} color={theme.dark700} />
      <TextInput
        placeholder={placeholder}
        readOnly={readOnly}
        placeholderTextColor={theme.dark700}
        style={[styles.input, { flex: 1 }]}
        onPress={onPress}
        onChangeText={onChangeText}
      />
      {!shouldHideEndIcon && (
        <Feather name="sliders" size={20} color={theme.dark700} />
      )}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    searchBar: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 20,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    ...SHARED_STYLES(theme),
  });
