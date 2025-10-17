import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  errorMessage?: string | null;
  onClear: () => void;
};

export function ErrorBanner({ errorMessage = '', onClear }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!errorMessage) {
    return null;
  }

  return (
    <Animated.View entering={FadeInUp} style={styles.errorBanner}>
      <Feather
        name="alert-triangle"
        size={18}
        color={styles.errorText.color as string}
      />
      <AppText style={styles.errorText} numberOfLines={3}>
        {errorMessage}
      </AppText>
      <TouchableOpacity
        onPress={onClear}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Feather name="x" size={18} color={styles.errorText.color as string} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: theme.errorBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.errorBorder,
    },
    errorText: {
      flex: 1,
      color: theme.errorText,
      fontSize: 14,
      fontWeight: '600',
    },
  });
