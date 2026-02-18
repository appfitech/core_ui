import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

/**
 * SVG/illustration search suggestions (unDraw, Storyset, Blush, etc.):
 * - Diet / nutrition: "healthy eating", "nutrition", "meal plan", "diet"
 * - Workout / routine: "fitness", "workout", "gym", "exercise", "dumbbell"
 * - Contract / services: "agreement", "document", "handshake"
 * - Exercise log: "fitness tracker", "checklist", "exercise log"
 * - Payments: "payment", "wallet", "income"
 * - Reviews: "review", "rating", "feedback"
 */

export default function WorkoutsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const title = isTrainer ? 'Panel de Gestión' : 'Panel de Entrenamiento';
  const subheader = isTrainer
    ? 'Controla y supervisa toda tu actividad desde un solo lugar.'
    : 'Gestiona tus recursos para mantenerte en forma y organizado.';

  const items = isTrainer
    ? [
        {
          key: 'trainer-diets',
          title: 'Dietas de clientes',
          description: 'Planes de alimentación de tus clientes',
          image: require('../../assets/images/vectors/diet_icon.png'),
        },
        {
          key: 'trainer-routines',
          title: 'Rutinas de clientes',
          description: 'Diseña rutinas y haz seguimiento',
          image: require('../../assets/images/vectors/workout_icon.png'),
        },
        {
          key: 'trainer-services',
          title: 'Mis Servicios',
          description: 'Administra lo que ofreces',
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
        {
          key: 'trainer-payments',
          title: 'Mis Pagos',
          description: 'Ingresos y transacciones',
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
        {
          key: 'trainer-reviews',
          title: 'Mis Calificaciones',
          description: 'Valoraciones de tus clientes',
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
      ]
    : [
        {
          key: 'exercises',
          title: 'Mi Registro de Entrenamientos',
          description: 'Control de workouts y metas',
          image: require('../../assets/images/vectors/exercises_icon.png'),
        },
        {
          key: 'diets',
          title: 'Mis Planes de Alimentación',
          description: 'Dietas personalizadas',
          image: require('../../assets/images/vectors/diet_icon.png'),
        },
        {
          key: 'routines',
          title: 'Mis Rutinas de Entrenamiento',
          description: 'Programas por objetivos y niveles',
          image: require('../../assets/images/vectors/workout_icon.png'),
        },
        {
          key: 'contracts',
          title: 'Mis Contratos',
          description: 'Contratos con entrenadores',
          image: require('../../assets/images/vectors/contract_icon.png'),
        },
      ];

  return (
    <PageContainer
      hasBackButton={false}
      title={title}
      subheader={subheader}
      style={{ paddingBottom: 150 }}
    >
      <View style={styles.list}>
        {items.map((item, i) => (
          <Animated.View
            key={item.key}
            entering={FadeInUp.delay(60 * i).duration(280)}
          >
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => router.push(`/${item.key}`)}
            >
              <View style={styles.iconWrap}>
                <Image
                  source={item.image}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textWrap}>
                <AppText style={styles.rowTitle}>{item.title}</AppText>
                <AppText style={styles.rowDescription} numberOfLines={1}>
                  {item.description}
                </AppText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    list: {
      paddingTop: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      columnGap: 18,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 28,
      height: 28,
    },
    textWrap: {
      flex: 1,
      minWidth: 0,
    },
    rowTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    rowDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
  });
