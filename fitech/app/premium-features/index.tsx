import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetUserMatchPreferences } from '../api/queries/use-get-user-match-preferences';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function PremiumFeaturesScreen() {
  const { theme } = useTheme();
  const { data: matchPreferences } = useGetUserMatchPreferences();
  const styles = getStyles(theme);

  return (
    <PageContainer
      hasBackButton={false}
      title="FITECH Premium"
      subheader="Funciones exclusivas para llevar tu entrenamiento al siguiente nivel"
      style={styles.pageStyle}
      contentPaddingBottom={220}
    >
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="star" size={18} color={theme.warning} />
          <AppText style={styles.heroBadgeText}>Premium</AppText>
        </View>
      </View>

      <View style={styles.cardList}>
        <TouchableOpacity
          style={[styles.card, styles.cardLibrary]}
          activeOpacity={0.85}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="library-outline" size={28} color={theme.primary} />
          </View>
          <View style={styles.cardContent}>
            <AppText style={styles.cardTitle}>Biblioteca</AppText>
            <AppText style={styles.cardDescription}>
              Colección de rutinas y movimientos: desde básicos hasta avanzados.
            </AppText>
          </View>
          <Image
            source={require('../../assets/images/vectors/gym_library.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {matchPreferences?.showInGymBro && (
          <TouchableOpacity
            onPress={() => router.push('/gymbro')}
            style={[styles.card, styles.cardGymBro]}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconWrap}>
              <Ionicons name="people-outline" size={28} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <AppText style={styles.cardTitle}>GymBro</AppText>
              <AppText style={styles.cardDescription}>
                Entrena acompañado. Conecta con alguien que entrene a tu ritmo.
              </AppText>
            </View>
            <Image
              source={require('../../assets/images/vectors/gym_bro.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {matchPreferences?.showInGymCrush && (
          <TouchableOpacity
            style={[styles.card, styles.cardGymCrush]}
            onPress={() => router.push('/gymcrush')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconWrap}>
              <Ionicons name="heart-outline" size={28} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <AppText style={styles.cardTitle}>GymCrush</AppText>
              <AppText style={styles.cardDescription}>
                Descubre entrenadores que se alinean con tus metas. Swipea y
                conecta.
              </AppText>
            </View>
            <Image
              source={require('../../assets/images/vectors/gym_crush.png')}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      rowGap: 12,
    },
    hero: {
      alignItems: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 8,
      marginTop: 12,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.warningBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      gap: 6,
    },
    heroBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.warningText,
    },

    cardList: {
      rowGap: 16,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      minHeight: 100,
    },
    cardLibrary: {
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    cardGymBro: {
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    cardGymCrush: {
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    cardIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: theme.backgroundInput,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    cardContent: {
      flex: 1,
      minWidth: 0,
      rowGap: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    cardImage: {
      width: 80,
      height: 80,
      marginLeft: 8,
    },
  });
