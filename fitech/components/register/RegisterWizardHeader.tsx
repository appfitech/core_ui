import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { BackButton } from '@/components/BackButton';
import { RegisterProgress } from '@/components/register/RegisterProgress';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle: string;
  onBack: () => void;
};

export function RegisterWizardHeader({
  step,
  total,
  title,
  subtitle,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <BackButton variant="light" onPress={onBack} />
      <RegisterProgress step={step} total={total} />
      <AppText variant="header" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" style={styles.subtitle}>
        {subtitle}
      </AppText>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 8,
    },
    title: {
      textAlign: 'left',
      marginTop: 4,
    },
    subtitle: {
      textAlign: 'left',
      lineHeight: 18,
      color: theme.text.secondary,
    },
  });
