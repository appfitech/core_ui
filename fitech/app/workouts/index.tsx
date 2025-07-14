import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const cards = [
    {
      key: 'diets',
      title: 'Mis Planes de Alimentación',
      description:
        'Consulta y ajusta tus dietas personalizadas para potenciar tu salud, energía y resultados en el entrenamiento.',
      backgroundColor: theme.dark200,
      image: require('../../assets/images/vectors/diet_icon.png'),
    },
    {
      key: 'routines',
      title: 'Mis Rutinas de Entrenamiento',
      description:
        'Accede a tus programas de ejercicios organizados por objetivos, niveles y días de entrenamiento.',
      backgroundColor: theme.dark200,
      image: require('../../assets/images/vectors/workout_icon.png'),
    },
    {
      key: 'contracts',
      title: 'Mis Contratos',
      description:
        'Revisa todos tus contratos con entrenadores: fechas, pagos, detalles del servicio y estado actual.',
      backgroundColor: theme.dark200,
      image: require('../../assets/images/vectors/contract_icon.png'),
    },
  ];

  return (
    <PageContainer
      hasBackButton={false}
      style={{ padding: 16, paddingBottom: 150 }}
    >
      <View style={{ rowGap: 10, paddingVertical: 10, marginBottom: 30 }}>
        <AnimatedAppText entering={FadeInUp.duration(400)} style={styles.title}>
          {'Panel de Entrenamiento'}
        </AnimatedAppText>
        <AnimatedAppText
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.subtitle}
        >
          {
            'Gestiona tus recursos clave para mantenerte en forma, organizado y motivado en tu proceso de entrenamiento.'
          }
        </AnimatedAppText>
      </View>

      {cards.map((card, i) => (
        <Animated.View
          key={card.key}
          entering={FadeInUp.delay(200 + i * 100).duration(400)}
        >
          <TouchableOpacity
            style={[styles.card, { backgroundColor: card.backgroundColor }]}
            activeOpacity={0.85}
            onPress={() => router.push(`/${card?.key}`)}
          >
            <View style={{ flex: 1 }}>
              <AppText style={styles.cardTitle}>{card.title}</AppText>
              <AppText style={styles.cardDescription}>
                {card.description}
              </AppText>
            </View>
            <Image
              source={card?.image}
              style={styles.image}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'row',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.dark900,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: 16,
      color: theme.dark700,
      lineHeight: 20,
    },
    image: {
      width: 120,
      height: '100%',
    },
    ...HEADING_STYLES(theme),
  });
