import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const cards = isTrainer
    ? [
        {
          key: 'trainer-diets',
          title: 'Dietas de clientes',
          description:
            'Consulta y gestiona los planes de alimentación de tus clientes. Personaliza cada dieta para adaptarla a sus objetivos y necesidades.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/diet_icon.png'),
        },
        {
          key: 'trainer-routines',
          title: 'Rutinas de clientes',
          description:
            'Diseña, organiza y actualiza las rutinas de entrenamiento. Haz seguimiento del progreso y ajusta ejercicios en tiempo real.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/workout_icon.png'),
        },
        {
          key: 'trainer-services',
          title: 'Mis Servicios',
          description:
            'Administra y promociona los servicios que ofreces. Muestra a tus clientes lo que puedes hacer por ellos.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
        {
          key: 'trainer-payments',
          title: 'Mis Pagos',
          description:
            'Revisa y lleva un control de tus ingresos y transacciones. Mantén un registro claro y seguro de tus cobros.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
        {
          key: 'trainer-reviews',
          title: 'Mis Calificaciones',
          description:
            'Consulta las valoraciones y comentarios que recibes de tus clientes. Usa el feedback para mejorar y destacar tu trabajo.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
      ]
    : [
        {
          key: 'exercises',
          title: 'Mi Registro de Entrenamientos',
          description:
            'Lleva el control de tus workouts y alcanza tus metas fitness.',
          backgroundColor: theme.dark200,
          image: require('../../assets/images/vectors/exercises_icon.png'),
        },
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
          {isTrainer ? 'Panel de Gestion' : 'Panel de Entrenamiento'}
        </AnimatedAppText>
        <AnimatedAppText
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.subtitle}
        >
          {isTrainer
            ? 'Controla y supervisa toda tu actividad desde un solo lugar. Accede rápidamente a las funciones más importantes para tu trabajo diario.'
            : 'Gestiona tus recursos clave para mantenerte en forma, organizado y motivado en tu proceso de entrenamiento.'}
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
