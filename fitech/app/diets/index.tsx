import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ListEmptyState } from '@/components/list/ListEmptyState';
import { ListFilterSection } from '@/components/list/ListFilterSection';
import PageContainer from '@/components/PageContainer';
import { ResourceCard } from '@/components/ResourceCard';
import {
  ACTIVE_INACTIVE_CHIPS,
  LIST_SCREEN_FLATLIST,
} from '@/constants/list-screens';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import {
  ActiveInactiveFilter,
  filterClientResourcesByActive,
} from '@/lib/list/filter-client-resources';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

export default function DietsScreen() {
  const [filter, setFilter] = useState<ActiveInactiveFilter>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { dietsScreen: copy, common, listFilters } = TRANSLATIONS;

  const { data: diets, isLoading } = useGetDiets();

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
      />
    ),
    [filter, listFilters.dietsActiveHint],
  );

  const renderItem = useCallback(
    ({ item }: { item: ClientResourceResponseDtoReadable }) => (
      <ResourceCard resource={item} onClick={handleOpenDetail} />
    ),
    [handleOpenDetail],
  );

  return (
    <PageContainer
      title={copy.title}
      subheader={copy.subheader}
      disableScroll
      style={styles.pageStyle}
    >
      <FlatList
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
      />
    </PageContainer>
  );
}

const getStyles = (_theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { paddingBottom: 0 },
    listContent: {
      paddingBottom: 180,
      flexGrow: 1,
    },
    separator: { height: LIST_SCREEN_FLATLIST.itemGap },
    loadingWrap: { paddingVertical: 48, alignItems: 'center' },
  });
