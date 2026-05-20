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
import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

export default function DietsScreen() {
  const [filter, setFilter] = useState<ActiveInactiveFilter>('ACTIVE');
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);

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
        hint="Mostrar solo planes activos o inactivos"
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
      title="Mis Planes Nutricionales"
      subheader="Dietas personalizadas para alcanzar tus objetivos de salud"
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
              title="No hay planes con este filtro"
              hint="Prueba el otro filtro o vuelve más tarde"
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
