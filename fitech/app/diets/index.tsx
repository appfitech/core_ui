import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ListFilterSection } from '@/components/list/ListFilterSection';
import { ListRefreshOverlay } from '@/components/list/ListRefreshOverlay';
import PageContainer from '@/components/PageContainer';
import { ResourceCard } from '@/components/ResourceCard';
import {
  ACTIVE_INACTIVE_CHIPS,
  LIST_SCREEN_FLATLIST,
} from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import { useListScreenRefresh } from '@/hooks/use-list-screen-refresh';
import {
  ActiveInactiveFilter,
  filterClientResourcesByActive,
} from '@/lib/list/filter-client-resources';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

export default function DietsScreen() {
  const [filter, setFilter] = useState<ActiveInactiveFilter>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { dietsScreen: copy, common, listFilters } = TRANSLATIONS;

  const { data: diets, isLoading, refetch } = useGetDiets();
  const { refreshing, refreshControl } = useListScreenRefresh(refetch);

  const filteredDiets = useMemo(
    () => filterClientResourcesByActive(diets, filter),
    [diets, filter],
  );

  const handleOpenDetail = useCallback(
    (dietId: number) => router.push(`/diets/${dietId}`),
    [router],
  );

  const listHeader = useMemo(
    () => (
      <ListFilterSection
        hint={listFilters.dietsActiveHint}
        chips={ACTIVE_INACTIVE_CHIPS}
        selectedValue={filter}
        onChipPress={(value) => setFilter(value as ActiveInactiveFilter)}
        style={styles.listHeader}
      />
    ),
    [filter, listFilters.dietsActiveHint, styles.listHeader],
  );

  const renderItem = useCallback(
    ({ item }: { item: ClientResourceResponseDtoReadable }) => (
      <ResourceCard resource={item} onClick={handleOpenDetail} />
    ),
    [handleOpenDetail],
  );

  return (
    <PageContainer title={copy.title} subheader={copy.subheader} disableScroll>
      <View style={styles.listWrap}>
        <FlatList
          style={LIST_SCREEN_FLATLIST.listStyle}
          overScrollMode={LIST_SCREEN_FLATLIST.overScrollMode}
          data={filteredDiets}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.brand.primary} />
              </View>
            ) : (
              <ListEmptyState
                title={copy.emptyTitle}
                hint={common.tryOtherFilterHint}
              />
            )
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
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

const getStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    listWrap: {
      flex: 1,
    },
    listHeader: {
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 180,
      flexGrow: 1,
    },
    separator: { height: 8 },
    loadingWrap: { paddingVertical: 48, alignItems: 'center' },
  });
