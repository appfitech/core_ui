import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { useGetRoutineById } from '@/app/api/queries/use-get-routine-by-id';
import { AppText } from '@/app/components/AppText';
import { Button } from '@/app/components/Button';
import PageContainer from '@/app/components/PageContainer';
import { Tag } from '@/app/components/Tag';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const ROUTINE_TEMPLATE_URL =
  'https://appfitech.com/v1/app/templates/plantilla_rutinas.xlsx';

export default function RoutineDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const styles = getStyles(theme);
  const routine = useGetRoutineById(Number(id));

  const handleDownload = async () => {
    try {
      await WebBrowser.openBrowserAsync(ROUTINE_TEMPLATE_URL);
    } catch (e) {
      console.error('[FITECH] error opening diet template', e);
    }
  };

  return (
    <PageContainer style={styles.pageStyle}>
      <View style={styles.headerBlock}>
        <AppText style={styles.titleHeader}>{routine?.resourceName}</AppText>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.tagsRow}>
          <Tag
            backgroundColor={theme.successBackground}
            textColor={theme.successText}
            label={routine?.isActive ? 'Activa' : 'Inactiva'}
          />
          <Tag
            backgroundColor={theme.infoBackground}
            textColor={theme.infoText}
            label={'Contrato'}
          />
        </View>
        <View style={[styles.card, styles.cardWithBg]}>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'calendar'} size={16} />
              &nbsp;{'Fecha creación'}
            </AppText>
            <AppText style={styles.content}>
              {`Creada el: ${routine.createdAt}`}
            </AppText>
          </View>
        </View>
        <Button label={'Descargar Excel'} onPress={handleDownload} />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    pageStyle: { padding: 16 },
    headerBlock: { marginBottom: 20 },
    titleHeader: {
      ...HEADING_STYLES(theme).title,
      textAlign: 'left',
      marginTop: 16,
      marginRight: 50,
    },
    contentSection: { rowGap: 20 },
    tagsRow: { flexDirection: 'row', columnGap: 10 },
    card: { borderRadius: 16, padding: 16, rowGap: 16 },
    cardWithBg: { backgroundColor: theme.dark100 },
    container: { rowGap: 8 },
    label: {
      fontSize: 18,
      fontWeight: 500,
      color: theme.backgroundInverted,
    },
    content: {
      fontSize: 16,
      fontWeight: 400,
      color: theme.dark700,
    },
  });
