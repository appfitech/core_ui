import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { SearchBar } from '@/components/SearchBar';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchTrainers } from '@/lib/api/mutations/use-search-trainers';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

export default function TrainersSearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicTrainerDtoReadable[]>([]);
  const { mutate } = useSearchTrainers();
  const router = useRouter();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const performSearch = useCallback(
    (q: string) => {
      const payload = q.trim().length === 0 ? {} : { query: q };
      mutate(payload, {
        onSuccess: (data: PublicTrainerDtoReadable[] | undefined) => {
          setResults(data ?? []);
        },
      });
    },
    [mutate],
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch],
  );

  useEffect(() => {
    debouncedSearch('');
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <PageContainer
      title="Encuentra tu entrenador ideal"
      subheader="Descubre entrenadores especializados en tus objetivos fitness"
      hasBackButton={false}
      style={styles.pageStyle}
    >
      <View style={styles.filterCard}>
        <AppText style={styles.filterHint}>
          Busca por nombre del entrenador
        </AppText>
        <SearchBar
          placeholder="Buscar por nombre"
          value={query}
          onChangeText={setQuery}
          shouldHideEndIcon={true}
          containerStyle={styles.searchBarContainer}
        />
      </View>

      <AppText style={styles.resultCount}>
        {results?.length ?? 0} entrenadores encontrados
      </AppText>

      <View style={styles.list}>
        {results?.map((trainer) => (
          <TouchableOpacity
            key={trainer.id ?? 0}
            style={styles.card}
            onPress={() => router.push(`/trainers/${trainer.id}`)}
            activeOpacity={0.78}
          >
            <Image
              source={{
                uri: `https://appfitech.com/v1/app/file-upload/view/${trainer.person?.profilePhotoId}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.cardContent}>
              <AppText style={styles.name}>
                {trainer.person?.firstName} {trainer.person?.lastName}
              </AppText>
              <AppText style={styles.bio} numberOfLines={3}>
                {trainer.person?.bio || 'Sin descripción'}
              </AppText>
              <View style={styles.ctaRow}>
                <AppText style={styles.ctaText}>Ver perfil</AppText>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.primaryText}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    filterCard: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 16,
    },
    filterHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    searchBarContainer: {
      width: '100%',
    },
    resultCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginTop: 16,
      marginBottom: 4,
    },
    list: {
      marginTop: 8,
      rowGap: 14,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      columnGap: 14,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    cardContent: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    bio: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
      lineHeight: 20,
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
      marginTop: 10,
    },
    ctaText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primaryText,
    },
  });
