import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  titleStyle?: TextStyle;
  /** When false, only renders children (no title or “Ver todo”). Default true. */
  showHeader?: boolean;
};

export function HomeSectionContainer({
  children,
  title,
  onClick,
  titleStyle,
  showHeader = true,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {showHeader ? (
        <View style={styles.sectionHeader}>
          <AppText style={[styles.sectionTitle, titleStyle]}>{title}</AppText>
          <TouchableOpacity onPress={onClick} style={styles.sectionAction}>
            <AppText style={styles.sectionActionText}>{'Ver todo'}</AppText>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.status.success.text}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
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
      color: theme.text.primary,
      fontSize: 15,
    },
    sectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionActionText: {
      color: theme.status.success.text,
      fontSize: 14,
      fontWeight: '700',
    },
  });
