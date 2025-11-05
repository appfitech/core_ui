import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
};

export function Card({ children, style }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Animated.View
      entering={SlideInLeft.springify().damping(25)}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.backgroundInverted,
      borderRadius: 16,
      padding: 16,
      shadowColor: theme.background,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
    },
  });
