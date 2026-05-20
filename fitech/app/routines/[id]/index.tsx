import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClientResourceDetailCard } from '@/components/list/ClientResourceDetailCard';
import PageContainer from '@/components/PageContainer';
import { TRANSLATIONS } from '@/constants/strings';
import { useGetRoutineById } from '@/lib/api/queries/use-get-routine-by-id';

const ROUTINE_TEMPLATE_URL =
  'https://appfitech.com/v1/app/templates/plantilla_rutinas.xlsx';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useGetRoutineById(Number(id));
  const { clientResourceScreen: copy } = TRANSLATIONS;

  const handleDownload = async () => {
    try {
      await WebBrowser.openBrowserAsync(ROUTINE_TEMPLATE_URL);
    } catch (e) {
      console.error('[FITECH] error opening routine template', e);
    }
  };

  return (
    <PageContainer
      title={routine?.resourceName ?? copy.defaultRoutineTitle}
      style={styles.page}
    >
      {routine ? (
        <>
          <ClientResourceDetailCard resource={routine} />
          <View style={styles.actions}>
            <Button
              label={copy.downloadExcel}
              onPress={handleDownload}
              style={styles.actionButton}
            />
          </View>
        </>
      ) : null}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 180 },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    width: '100%',
  },
});
