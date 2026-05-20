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
import { useTheme } from '@/contexts/ThemeContext';
import {
  ActiveInactiveFilter,
  filterClientResourcesByActive,
} from '@/lib/list/filter-client-resources';
import { useGetRoutines } from '@/lib/api/queries/use-get-routines';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';

export default function RoutinesScreen() {
  const [filter, setFilter] = useState<ActiveInactiveFilter>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();

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
        hint="Mostrar solo rutinas activas o inactivas"
        chips={ACTIVE_INACTIVE_CHIPS}
        selectedValue={filter}
        onChipPress={(value) => setFilter(value as ActiveInactiveFilter)}
      />
    ),
    [filter],
  );

  const renderItem = useCallback(
    ({ item }: { item: ClientResourceResponseDtoReadable }) => (
      <ResourceCard resource={item} onClick={handleOpenDetail} />
    ),
    [handleOpenDetail],
  );

  return (
    <PageContainer
      title="Mis Rutinas de Entrenamiento"
      subheader="Organiza, sigue y mejora tus sesiones de entrenamiento"
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
              title="No hay rutinas con este filtro"
              hint="Prueba el otro filtro o vuelve más tarde"
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
