import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const BUTTON_SIZE = 40;
const ICON_SIZE = 22;

type Props = {
  /** Use "light" when the button sits on a dark background (e.g. PageContainer fixed header) */
  variant?: 'default' | 'light';
  onPress?: () => void;
};

export function BackButton({ variant = 'default', onPress }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const isLight = variant === 'light';
  const styles = getStyles(theme, isLight);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress ?? (() => router.back())}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel="Volver"
    >
      <Ionicons
        name="arrow-back"
        size={ICON_SIZE}
        color={isLight ? theme.textPrimary : theme.background}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme, isLight: boolean) =>
  StyleSheet.create({
    button: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BUTTON_SIZE / 2,
      backgroundColor: isLight ? theme.headerBackButtonBg : theme.dark900,
      borderWidth: isLight ? theme.headerBackButtonBorderWidth : 0,
      borderColor: isLight ? theme.headerBackButtonBorder : 'transparent',
      shadowColor: '#000',
      shadowOpacity: isLight ? 0.2 : 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    icon: {
      // arrow-back glyph is optically left-heavy
      marginLeft: 1,
    },
  });
