import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  titleStyle?: TextStyle;
};

export function HomeSectionContainer({
  children,
  title,
  onClick,
  titleStyle,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <AppText style={[styles.sectionTitle, titleStyle]}>{title}</AppText>
        <TouchableOpacity onPress={onClick} style={styles.sectionAction}>
          <AppText style={styles.sectionActionText}>{'Ver todo'}</AppText>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.successText}
          />
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
