import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ClientResourceDetailCard } from '@/components/list/ClientResourceDetailCard';
import PageContainer from '@/components/PageContainer';
import { TRANSLATIONS } from '@/constants/strings';
import { useGetDietById } from '@/lib/api/queries/use-get-diet-by-id';

const FILE_DOWNLOAD_BASE = 'https://appfitech.com/v1/app/file-upload/download';

export default function DietDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const diet = useGetDietById(Number(id));
  const { clientResourceScreen: copy } = TRANSLATIONS;

  const handleDownload = useCallback(async () => {
    if (diet?.fileId == null) return;

    try {
      await WebBrowser.openBrowserAsync(`${FILE_DOWNLOAD_BASE}/${diet.fileId}`);
    } catch (e) {
      console.error('[FITECH] error opening diet file', e);
    }
  }, [diet?.fileId]);

  return (
    <PageContainer
      title={diet?.resourceName ?? copy.defaultDietTitle}
      style={styles.page}
    >
      {diet ? (
        <>
          <ClientResourceDetailCard resource={diet} />
          <View style={styles.actions}>
            <Button
              label={copy.downloadExcel}
              onPress={handleDownload}
              disabled={diet.fileId == null}
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
