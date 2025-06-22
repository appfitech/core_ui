import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetRoutines } from '../api/queries/use-get-routines';
import { BackButton } from '../components/BackButton';

export default function RoutinesScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const insets = useSafeAreaInsets();

  const { data: routines } = useGetRoutines();

  const filteredRoutines = useMemo(
    () => (filter === 'ACTIVE' ? routines : []),
    [routines, filter],
  );

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
      <View style={{ marginTop: 0, marginBottom: 60 }}>
        <BackButton />
      </View>
      <Text style={styles.header}>Mis Planes Nutricionales</Text>
      <Text style={styles.subheader}>
        Dietas personalizadas para alcanzar tus objetivos de salud
      </Text>

      <View style={styles.tabRow}>
        {['ACTIVE', 'INACTIVE'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tabButton,
              filter === status && styles.tabButtonActive,
            ]}
            onPress={() => setFilter(status as 'ACTIVE' | 'INACTIVE')}
          >
            <Text
              style={[
                styles.tabText,
                filter === status && styles.tabTextActive,
              ]}
            >
              {status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredRoutines?.map((routine) => (
        <View style={styles.card} key={routine.id}>
          <Text style={styles.title}>{routine.resourceName}</Text>
          <Text style={styles.sub}>👤 {routine.trainerName}</Text>
          <Text style={styles.sub}>📄 {routine.serviceName}</Text>

          <View style={styles.badgeContainer}>
            <Text
              style={[
                styles.badge,
                routine.isActive ? styles.active : styles.inactive,
              ]}
            >
              {routine.isActive ? 'Activa' : 'Inactiva'}
            </Text>
            <Text style={styles.contract}>Contrato</Text>
          </View>

          <Text style={styles.label}>🎯 Objetivo</Text>
          <Text style={styles.content}>{routine.resourceObjective}</Text>

          <Text style={styles.label}>{'📋 Programa de Entrenamiento'}</Text>
          <Text style={styles.box}>{routine.resourceDetails}</Text>

          <Text style={styles.label}>📝 Notas del Trainer</Text>
          <Text style={styles.box}>{routine.trainerNotes}</Text>

          <Text>📅 Inicio: {routine.startDate}</Text>
          <Text>🕒 Creada el: {routine.createdAt}</Text>

          <TouchableOpacity style={[styles.pdfButton, styles.pdfRutina]}>
            <Text style={styles.pdfButtonText}>Descargar PDF</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#0F4C81',
  },
  tabText: {
    fontSize: 14,
    color: '#0F4C81',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: '#666', marginBottom: 2 },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    color: '#fff',
  },
  active: { backgroundColor: 'green' },
  inactive: { backgroundColor: 'gray' },
  contract: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    marginLeft: 6,
  },
  label: { fontWeight: 'bold', marginTop: 8 },
  content: { fontStyle: 'italic' },
  box: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  pdfButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  pdfDieta: { backgroundColor: '#f39c12' },
  pdfRutina: { backgroundColor: '#8e44ad' },
  pdfButtonText: { color: '#fff', fontWeight: 'bold' },
});
