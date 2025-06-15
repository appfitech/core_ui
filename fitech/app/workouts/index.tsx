import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const cards = [
    {
      key: 'diets',
      title: 'Mis Planes de Alimentación',
      description:
        'Consulta y ajusta tus dietas personalizadas para potenciar tu salud, energía y resultados en el entrenamiento.',
      backgroundColor: '#E1F5FE',
    },
    {
      key: 'routines',
      title: 'Mis Rutinas de Entrenamiento',
      description:
        'Accede a tus programas de ejercicios organizados por objetivos, niveles y días de entrenamiento.',
      backgroundColor: '#B3E5FC',
    },
    {
      key: 'contracts',
      title: 'Mis Contratos',
      description:
        'Revisa todos tus contratos con entrenadores: fechas, pagos, detalles del servicio y estado actual.',
      backgroundColor: '#81D4FA',
    },
    {
      key: 'trainers',
      title: 'Buscar y Conectar con Entrenadores',
      description:
        'Explora perfiles de entrenadores, compara planes y encuentra el mejor apoyo para lograr tus metas.',
      backgroundColor: '#4FC3F7',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          minHeight: '100%',
        },
      ]}
    >
      <Animated.Text entering={FadeInUp.duration(400)} style={styles.pageTitle}>
        Panel de Entrenamiento
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.pageSubtitle}
      >
        Gestiona tus recursos clave para mantenerte en forma, organizado y
        motivado en tu proceso de entrenamiento.
      </Animated.Text>

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
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F4C81',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 48,
    lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F4C81',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#0F4C81',
    lineHeight: 20,
  },
});
