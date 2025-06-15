import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserStore } from '../stores/user';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const handleSupportClick = useCallback(() => router.push('/support'), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text
              style={styles.greeting}
            >{`Hola ${user?.user?.person.firstName}`}</Text>
            <Text style={styles.subtext}>Buen día</Text>
          </View>
          <TouchableOpacity onPress={handleSupportClick}>
            <Ionicons name="help-circle-outline" size={28} color="#0F4C81" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Buscar rutina..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <Ionicons name="options-outline" size={20} color="#0F4C81" />
        </View>

        <LinearGradient colors={['#6A5AE0', '#7B63E7']} style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Mi Plan de Hoy</Text>
            <View style={styles.planDate}>
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.planDateText}>Nov 11, 2023</Text>
            </View>
          </View>
          <View style={styles.planMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>89</Text>
              <Text style={styles.metricLabel}>Kg</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>500</Text>
              <Text style={styles.metricLabel}>Kcal</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>45%</Text>
              <Text style={styles.metricLabel}>Hoy</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['General', 'Cardio', 'Fuerza', 'Flexibilidad', 'Funcional'].map(
              (cat, index) => (
                <View key={index} style={styles.category}>
                  <Image
                    source={require('../../assets/images/bg/bg_1.jpg')}
                    style={styles.categoryImage}
                  />
                  <Text style={styles.categoryLabel}>{cat}</Text>
                </View>
              ),
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Populares</Text>
          {[1, 2].map((item) => (
            <View key={item} style={styles.workoutCard}>
              <Image
                source={require('../../assets/images/bg/bg_1.jpg')}
                style={styles.workoutImage}
              />
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>Jump Rope</Text>
                <Text style={styles.workoutSub}>
                  110 Kcal · 10 Min · 9 Steps
                </Text>
                <Text style={styles.workoutTag}>Principiante</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 28, fontWeight: '700', color: '#0F4C81' },
  subtext: { fontSize: 20, color: '#555' },
  searchBar: {
    backgroundColor: '#F1F3F5',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  planCard: {
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 24,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  planDate: { flexDirection: 'row', alignItems: 'center' },
  planDateText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  planMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center' },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: '700' },
  metricLabel: { color: '#fff', fontSize: 12 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
  },
  category: { alignItems: 'center', marginHorizontal: 8 },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  categoryLabel: { fontSize: 12, marginTop: 4 },
  workoutCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutImage: { width: 80, height: 80, backgroundColor: '#ccc' },
  workoutInfo: { padding: 8, flex: 1, justifyContent: 'center' },
  workoutTitle: { fontSize: 14, fontWeight: '600' },
  workoutSub: { fontSize: 12, color: '#555', marginTop: 2 },
  workoutTag: { fontSize: 10, color: '#FF914D', marginTop: 4 },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F4C81',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
