import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  step: number;
  total: number;
};

export function RegisterProgress({ step, total }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const progress = (step + 1) / total;

  return (
    <View style={styles.container}>
      <AppText style={styles.stepLabel}>
        Paso {step + 1} de {total}
      </AppText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 20,
    },
    stepLabel: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '500',
      marginBottom: 10,
    },
    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.dark300,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: theme.primary,
    },
  });
