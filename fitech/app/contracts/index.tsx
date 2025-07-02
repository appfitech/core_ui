import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Contract } from '@/types/contracts';

import { useGetActiveContracts } from '../api/queries/use-get-active-contracts';
import { useGetInactiveContracts } from '../api/queries/use-get-inactive-contracts';
import { BackButton } from '../components/BackButton';

export default function ContractsScreen() {
  const [filter, setFilter] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const insets = useSafeAreaInsets();

  const { data: activeContracts } = useGetActiveContracts();
  const { data: inactiveContracts } = useGetInactiveContracts();

  const filteredContracts = useMemo(
    () => (filter === 'ACTIVE' ? activeContracts : inactiveContracts),
    [activeContracts, inactiveContracts, filter],
  );

  const handleDetails = (contract: Contract) => {
    // Hook your bottom sheet / drawer logic here
    console.log('Open details for contract:', contract);
  };

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
      <Text style={styles.header}>Mis Contratos</Text>
      <Text style={styles.subheader}>
        Gestiona tus contratos de servicios de entrenamiento
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

      {filteredContracts?.map((contract) => (
        <View key={contract.id} style={styles.card}>
          <Text style={styles.cardTitle}>{contract.serviceName}</Text>
          <View style={styles.cardRow}>
            <Ionicons name="person" size={14} color="#0F4C81" />
            <Text style={styles.cardInfo}>
              Trainer ID: {contract.trainerId}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="calendar" size={14} color="#0F4C81" />
            <Text style={styles.cardInfo}>Inicio: {contract.startDate}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="card" size={14} color="#0F4C81" />
            <Text style={styles.cardInfo}>
              Monto: S/ {contract.totalAmount.toFixed(2)}
            </Text>
          </View>
          {contract.contractStatus === 'ACTIVE' && (
            <View style={styles.activeTag}>
              <Ionicons name="flash" size={14} color="#fff" />
              <Text style={styles.activeText}>
                ¡Tu entrenamiento está activo!
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleDetails(contract)}
          >
            <Text style={styles.detailsButtonText}>Ver Detalles</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardInfo: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
  },
  activeTag: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  activeText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: '#0F4C81',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 4,
  },
});
