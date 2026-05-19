import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ROUTES } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

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
        <View style={styles.imageWrap}>
          <Image
            source={require('@/assets/images/products/macros.jpg')}
            style={styles.image}
            resizeMode={'cover'}
          />
        </View>
        <View style={styles.textContainer}>
          <AppText style={styles.body}>{'¿Qué lleva tu plato?'}</AppText>
          <AppText style={styles.caption}>
            {'Busca un alimento y calcula calorías y macros al instante.'}
          </AppText>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) => {
  return StyleSheet.create({
    ...textStyles(theme),
    card: {
      flexDirection: 'row',
      columnGap: 16,
      alignItems: 'center',
      padding: 0,
      height: 100,
    },
    imageWrap: {
      width: 85,
    },
    image: {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      width: '100%',
      height: '100%',
    },
    textContainer: { flex: 1, rowGap: 6, padding: 12 },
  });
};
