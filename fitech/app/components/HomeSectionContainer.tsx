import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
};

export function HomeSectionContainer({ children, title, onClick }: Props) {
  // Hooks
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <TouchableOpacity onPress={onClick} style={styles.sectionAction}>
          <AppText style={styles.sectionActionText}>{'Ver todo'}</AppText>
          <Feather color={theme.successText} size={16} name="chevrons-right" />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      rowGap: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 15,
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionActionText: {
      color: theme.successText,
      fontSize: 14,
      fontWeight: '700',
    },
  });
