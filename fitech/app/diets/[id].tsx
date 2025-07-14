import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetDietById } from '../api/queries/use-get-diet-by-id';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function DietDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const styles = getStyles(theme);

  const diet = useGetDietById(Number(id));

  return (
    <PageContainer style={{ padding: 16 }}>
      <View style={{ marginBottom: 20 }}>
        <AppText style={styles.title}>{diet?.resourceName}</AppText>
      </View>
      <View style={{ rowGap: 10 }}>
        <View style={[styles.card, { backgroundColor: theme.dark100 }]}>
          <AppText style={styles.label}>{'Objetivo'}</AppText>
          <AppText style={styles.content}>{diet?.resourceObjective}</AppText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark200 }]}>
          <AppText style={styles.label}>{'Plan Nutricional Detallado'}</AppText>
          <AppText style={styles.content}>{diet?.resourceDetails}</AppText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark100 }]}>
          <AppText style={styles.label}>{'Notas del Trainer'}</AppText>
          <AppText style={styles.content}>{diet?.trainerNotes}</AppText>
        </View>

        <AppText>📅 Inicio: {diet.startDate}</AppText>
        <AppText>🕒 Creada el: {diet.createdAt}</AppText>
      </View>
      <TouchableOpacity style={styles.pdfButton}>
        <AppText style={styles.pdfButtonText}>Descargar PDF</AppText>
      </TouchableOpacity>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: { borderRadius: 16, padding: 16, rowGap: 6 },
    label: { fontSize: 18, fontWeight: 600, color: theme.backgroundInverted },
    content: { fontSize: 16, fontWeight: 400, color: theme.dark700 },
    ...HEADING_STYLES(theme),
  });
