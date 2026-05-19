import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { authCardEnter } from '@/utils/platform-animations';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
  /** Lighter entrance on Android (auth screens). */
  authStyle?: boolean;
};

export function Card({ children, style, authStyle = false }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Animated.View
      entering={authStyle ? authCardEnter() : FadeInUp.duration(250)}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 16,
    },
  });
