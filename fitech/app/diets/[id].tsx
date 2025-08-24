import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { useGetDietById } from '../api/queries/use-get-diet-by-id';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';
import { Tag } from '../components/Tag';

export default function DietDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const styles = getStyles(theme);
  const diet = useGetDietById(Number(id));

  return (
    <PageContainer style={{ padding: 16 }}>
      <View style={{ marginBottom: 20 }}>
        <AppText
          style={[
            styles.title,
            { textAlign: 'left', marginTop: 16, marginRight: 50 },
          ]}
        >
          {diet?.resourceName}
        </AppText>
      </View>

      <View style={{ rowGap: 20 }}>
        <View style={{ flexDirection: 'row', columnGap: 10 }}>
          <Tag
            backgroundColor={theme.successBackground}
            textColor={theme.successText}
            label={diet?.isActive ? 'Activa' : 'Inactiva'}
          />
          <Tag
            backgroundColor={theme.infoBackground}
            textColor={theme.infoText}
            label={'Contrato'}
          />
        </View>
        <View style={[styles.card, { backgroundColor: theme.dark100 }]}>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'check-square'} size={16} />
              &nbsp;{'Objetivo'}
            </AppText>
            <AppText style={styles.content}>{diet?.resourceObjective}</AppText>
          </View>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'edit'} size={16} />
              &nbsp;{'Plan Nutricional Detallado'}
            </AppText>
            <AppText style={styles.content}>{diet?.resourceDetails}</AppText>
          </View>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'calendar'} size={16} />
              &nbsp;{'Fecha creación'}
            </AppText>
            <AppText style={styles.content}>
              {`Creada el: ${diet.createdAt}`}
            </AppText>
          </View>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'play'} size={16} />
              &nbsp;{'Inicio del plan'}
            </AppText>
            <AppText style={styles.content}>{diet.startDate}</AppText>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: theme.dark200 }]}>
          <View style={styles.container}>
            <AppText style={styles.label}>
              <Feather name={'file-minus'} size={16} />
              &nbsp;{'Notas del Trainer'}
            </AppText>
            <AppText style={styles.content}>{diet?.trainerNotes}</AppText>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: { borderRadius: 16, padding: 16, rowGap: 16 },
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
    ...HEADING_STYLES(theme),
  });
