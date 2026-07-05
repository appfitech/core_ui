import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ListFilterSection } from '@/components/list/ListFilterSection';
import { ListRefreshOverlay } from '@/components/list/ListRefreshOverlay';
import { TrainerListCard } from '@/components/list/TrainerListCard';
import PageContainer from '@/components/PageContainer';
import { SearchBar } from '@/components/SearchBar';
import { LIST_SCREEN_FLATLIST } from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchTrainers } from '@/lib/api/mutations/use-search-trainers';
import { useListScreenRefresh } from '@/hooks/use-list-screen-refresh';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const LIST_GAP = 8;

export default function TrainersSearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicTrainerDtoReadable[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const { mutate } = useSearchTrainers();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { trainersScreen: copy } = TRANSLATIONS;

  const performSearch = useCallback(
    (q: string) => {
      const payload = q.trim().length === 0 ? {} : { query: q };
      setIsSearching(true);
      mutate(payload, {
        onSuccess: (data) => {
          setResults(data ?? []);
          setIsSearching(false);
        },
        onError: () => setIsSearching(false),
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

  const handleRefresh = useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        const payload = query.trim().length === 0 ? {} : { query: query.trim() };
        mutate(payload, {
          onSuccess: (data) => {
            setResults(data ?? []);
            setIsSearching(false);
            resolve();
          },
          onError: () => {
            setIsSearching(false);
            reject(new Error('trainer search failed'));
          },
        });
      }),
    [mutate, query],
  );

  const { refreshing, refreshControl } = useListScreenRefresh(handleRefresh);

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeaderWrap}>
        <ListFilterSection hint={copy.searchHint} style={styles.filterSection}>
          <SearchBar
            placeholder={copy.searchPlaceholder}
            value={query}
            onChangeText={setQuery}
            shouldHideEndIcon
            containerStyle={styles.searchBar}
          />
        </ListFilterSection>
        <AppText style={styles.resultCount}>
          {results.length === 1
            ? copy.resultCountOne
            : copy.resultCountMany.replace('{count}', String(results.length))}
        </AppText>
      </View>
    ),
    [
      copy,
      query,
      results.length,
      styles.filterSection,
      styles.listHeaderWrap,
      styles.resultCount,
      styles.searchBar,
    ],
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      hasBackButton={false}
      disableScroll
      style={styles.pageStyle}
    >
      <View style={styles.listWrap}>
        <FlatList
          style={LIST_SCREEN_FLATLIST.listStyle}
          overScrollMode={LIST_SCREEN_FLATLIST.overScrollMode}
          data={results}
          keyExtractor={(item) =>
            String(item.id ?? item.person?.id ?? Math.random())
          }
          renderItem={({ item }) => (
            <TrainerListCard
              trainer={item}
              onPress={() => router.push(`/trainers/${item.id}`)}
            />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            isSearching ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.brand.primary} />
              </View>
            ) : (
              <ListEmptyState title={copy.emptyTitle} hint={copy.emptyHint} />
            )
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
          maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
          windowSize={LIST_SCREEN_FLATLIST.windowSize}
          removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
          refreshControl={refreshControl}
        />
        <ListRefreshOverlay visible={refreshing} />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 0 },
    listWrap: {
      flex: 1,
    },
    listHeaderWrap: {
      marginBottom: 16,
    },
    filterSection: {
      marginBottom: 0,
    },
    listContent: {
      paddingTop: 12,
      paddingBottom: 180,
      flexGrow: 1,
    },
    searchBar: { width: '100%' },
    resultCount: {
      ...text.smallSemibold,
      color: theme.text.secondary,
      marginTop: 12,
    },
    separator: { height: LIST_GAP },
    loadingWrap: { paddingVertical: 48, alignItems: 'center' },
  });
};
