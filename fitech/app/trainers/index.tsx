import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { Trainer } from '@/types/trainer';

import { useSearchTrainers } from '../api/mutations/use-search-trainers';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import PageContainer from '../components/PageContainer';
import { SearchBar } from '../components/SearchBar';

export default function TrainersSearchScreen() {
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
    <PageContainer
      header={'Encuentra tu \nentrenador ideal'}
      subheader={
        'Descubre entrenadores especializados en tus objetivos fitness'
      }
      hasBackButton={false}
      style={styles.pageStyle}
    >
      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Buscar por nombre"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
          containerStyle={styles.searchBarContainer}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="chevrons-forward" size={22} color={theme.dark100} />
        </TouchableOpacity>
      </View>

      <AppText style={styles.resultCount}>
        {results?.length} entrenadores encontrados
      </AppText>

      <View style={styles.resultsList}>
        {results?.map((trainer) => (
          <Card key={trainer.id} style={styles.cardRow}>
            <Image
              source={{
                uri: `https://appfitech.com/v1/app/file-upload/view/${trainer.person.profilePhotoId}`,
              }}
              style={styles.trainerAvatar}
            />
            <View style={styles.cardContent}>
              <AppText style={styles.name}>
                {trainer.person.firstName} {trainer.person.lastName}
              </AppText>
              <AppText style={styles.bio} numberOfLines={3}>
                {trainer.person.bio}
              </AppText>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => router.push(`/trainers/${trainer.id}`)}
                >
                  <Text style={styles.profileText}>{'Ver Perfil'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => router.push(`/trainers/${trainer.id}`)}
                >
                  <AppText style={styles.contactText}>{'Contactar'}</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: {
      padding: 16,
    },
    searchRow: {
      flexDirection: 'row',
      marginBottom: 20,
      columnGap: 4,
      alignItems: 'center',
    },
    searchBarContainer: {
      width: 'unset',
      flex: 1,
    },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      height: 43,
      width: 43,
    },
    resultsList: {
      rowGap: 12,
    },
    cardRow: {
      flexDirection: 'row',
      columnGap: 10,
      backgroundColor: theme.dark200,
    },
    trainerAvatar: {
      width: 100,
      height: 100,
      borderRadius: 100,
    },
    cardContent: {
      flex: 1,
    },
    resultCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.dark800,
      marginBottom: 12,
      alignSelf: 'flex-end',
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
    ...HEADING_STYLES(theme),
  });
