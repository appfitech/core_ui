import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

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
import { useGetRoutines } from '@/lib/api/queries/use-get-routines';
import {
  ActiveInactiveFilter,
  filterClientResourcesByActive,
} from '@/lib/list/filter-client-resources';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

export default function RoutinesScreen() {
  const [filter, setFilter] = useState<ActiveInactiveFilter>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();
  const { routinesScreen: copy, common, listFilters } = TRANSLATIONS;

  const { data: routines, isLoading } = useGetRoutines();

  const filteredRoutines = useMemo(
    () => filterClientResourcesByActive(routines, filter),
    [routines, filter],
  );

  const handleOpenDetail = useCallback(
    (routineId: number) => router.push(`/routines/${routineId}`),
    [router],
  );

  const listHeader = useMemo(
    () => (
      <ListFilterSection
        hint={listFilters.routinesActiveHint}
        chips={ACTIVE_INACTIVE_CHIPS}
        selectedValue={filter}
        onChipPress={(value) => setFilter(value as ActiveInactiveFilter)}
      />
    ),
    [filter, listFilters.routinesActiveHint],
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
      style={{ paddingBottom: 0 }}
    >
      <FlatList
        data={filteredRoutines}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}>
              <ActivityIndicator color={theme.brand.primary} />
            </View>
          ) : (
            <ListEmptyState
              title={copy.emptyTitle}
              hint={common.tryOtherFilterHint}
            />
          )
        }
        contentContainerStyle={{
          paddingBottom: 180,
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: LIST_SCREEN_FLATLIST.itemGap }} />
        )}
        showsVerticalScrollIndicator={false}
        initialNumToRender={LIST_SCREEN_FLATLIST.initialNumToRender}
        maxToRenderPerBatch={LIST_SCREEN_FLATLIST.maxToRenderPerBatch}
        windowSize={LIST_SCREEN_FLATLIST.windowSize}
        removeClippedSubviews={LIST_SCREEN_FLATLIST.removeClippedSubviews}
      />
    </PageContainer>
  );
}
