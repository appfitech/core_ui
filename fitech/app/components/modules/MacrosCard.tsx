import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from '../AppText';
import { Card } from '../Card';

export function MacrosCard() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      onPress={() => router.push(ROUTES.macrosCalculator)}
      activeOpacity={0.85}
    >
      <Card style={styles.card}>
        <View style={{ width: 70 }}>
          <Image
            source={require('../../../assets/images/vectors/macro_icon.png')}
            style={styles.image}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.textContainer}>
          <AppText style={styles.title}>{'¿Este snack es fit o fat?'}</AppText>
          <AppText style={styles.subtitle}>
            {'Busca tus alimentos favoritos y revisa sus macros sin juzgar 😌'}
          </AppText>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      columnGap: 16,
      alignItems: 'center',
      backgroundColor: theme.background,
      borderLeftWidth: 5,
      borderLeftColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 4,
    },
    image: {
      width: '100%',
      height: 100,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 19,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    textContainer: { flex: 1, rowGap: 6 },
  });
