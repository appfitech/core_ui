import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';

import { useSearchTrainers } from '../api/mutations/use-search-trainers';
import { SearchBar } from '../components/SearchBar';
import { FullTheme } from '../types/theme';
import { Trainer } from '../types/trainer';

export default function TrainersSearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Trainer[]>([]);
  const { mutate } = useSearchTrainers();
  const router = useRouter();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const performSearch = useCallback(
    debounce((q: string) => {
      const payload = q.trim().length === 0 ? {} : { query: q };
      mutate(payload, {
        onSuccess: (data) => {
          setResults(data);
        },
      });
    }, 500),
    [mutate],
  );

  useEffect(() => {
    performSearch('');
  }, []);

  useEffect(() => {
    performSearch(query);
  }, [query]);

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
      <Text style={styles.title}>{'Encuentra tu \nentrenador ideal'}</Text>
      <Text style={styles.subtitle}>
        {'Descubre entrenadores especializados en tus objetivos fitness'}
      </Text>

      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar por nombre"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="chevrons-right" size={22} color={theme.dark100} />
        </TouchableOpacity>
      </View>

      <Text style={styles.resultCount}>
        {results?.length} entrenadores encontrados
      </Text>

      {results?.map((trainer) => (
        <View key={trainer.id} style={styles.card}>
          <Image
            source={{
              uri: `https://appfitech.com/v1/app/file-upload/view/${trainer.person.profilePhotoId}`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {trainer.person.firstName} {trainer.person.lastName}
          </Text>
          <Text style={styles.bio} numberOfLines={2}>
            {trainer.person.bio}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push(`/trainers/${trainer.id}`)}
            >
              <Text style={styles.profileText}>Ver Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push(`/trainers/${trainer.id}`)}
            >
              <Text style={styles.contactText}>Contactar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    searchRow: {
      flexDirection: 'row',
      marginBottom: 20,
      columnGap: 4,
      alignItems: 'center',
    },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 43,
      width: 43,
    },
    resultCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.dark800,
      marginBottom: 12,
      alignSelf: 'flex-end',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    avatar: {
      width: '100%',
      height: 160,
      borderRadius: 8,
      marginBottom: 8,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      color: '#0F4C81',
    },
    bio: {
      fontSize: 12,
      color: '#555',
      marginTop: 4,
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: 8,
      justifyContent: 'space-between',
    },
    profileButton: {
      backgroundColor: '#0F4C81',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    profileText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    contactButton: {
      borderColor: '#0F4C81',
      borderWidth: 1,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    contactText: {
      color: '#0F4C81',
      fontSize: 12,
      fontWeight: '600',
    },
  });
