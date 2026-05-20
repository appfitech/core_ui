import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  avatarUri?: string | null;
  label: string;
  value: string;
};

export function ContractDetailRow({ icon, avatarUri, label, value }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.row}>
      <View style={styles.leading}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : icon ? (
          <Ionicons name={icon} size={18} color={theme.brand.primary} />
        ) : null}
      </View>

      <View style={styles.content}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={styles.value} numberOfLines={3}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    leading: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.brand.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatar: {
      width: 40,
      height: 40,
    },
    content: {
      flex: 1,
      minWidth: 0,
      rowGap: 2,
    },
    label: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    value: {
      ...text.smallMedium,
      color: theme.text.primary,
      lineHeight: 20,
    },
  });
};
