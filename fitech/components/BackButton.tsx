import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useSmartBack } from '@/hooks/use-smart-back';
import { AppTheme } from '@/types/theme';

const BUTTON_SIZE = 36;
const ICON_SIZE = 20;

type Props = {
  /** Use "light" when the button sits on a dark background (e.g. PageContainer fixed header) */
  variant?: 'default' | 'light';
  onPress?: () => void;
};

export function BackButton({ variant = 'default', onPress }: Props) {
  const { theme } = useTheme();
  const isLight = variant === 'light';
  const styles = getStyles(theme, isLight);

  const handleBack = useSmartBack();
  const handlePress = onPress ?? handleBack;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel="Volver"
    >
      <Ionicons
        name="chevron-back"
        size={ICON_SIZE}
        color={isLight ? theme.text.primary : theme.background.app}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const getStyles = (theme: AppTheme, isLight: boolean) =>
  StyleSheet.create({
    button: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: isLight ? theme.header.backButtonBg : theme.text.primary,
      borderWidth: isLight ? theme.header.backButtonBorderWidth : 0,
      borderColor: isLight ? theme.border.default : 'transparent',
    },
    icon: {
      marginLeft: -1,
    },
  });
