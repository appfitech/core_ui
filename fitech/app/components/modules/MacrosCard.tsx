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
    <TouchableOpacity onPress={() => router.push(ROUTES.macrosCalculator)}>
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
      flex: 1,
      flexDirection: 'row',
      columnGap: 15,
      alignItems: 'center',
      backgroundColor: theme.backgroundInverted,
    },
    image: {
      width: '100%',
      height: 100,
    },
    title: {
      color: theme.dark100,
      fontSize: 19,
      fontWeight: '800',
    },
    subtitle: { color: theme.dark300, fontSize: 16.5 },
    textContainer: { flex: 1, rowGap: 8 },
  });
