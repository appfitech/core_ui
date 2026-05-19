import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  step: number;
  total: number;
};

const PROGRESS_DURATION_MS = 400;

export function RegisterProgress({ step, total }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const trackWidth = useSharedValue(0);
  const progress = useSharedValue((step + 1) / total);

  useEffect(() => {
    progress.value = withTiming((step + 1) / total, {
      duration: PROGRESS_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, step, total]);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) {
      trackWidth.value = width;
    }
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * progress.value,
  }));

  return (
    <View style={styles.container}>
      <AppText style={styles.stepLabel}>
        Paso {step + 1} de {total}
      </AppText>
      <View style={styles.track} onLayout={onTrackLayout}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 20,
    },
    stepLabel: {
      color: theme.textSecondary,
      ...text.nav,
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
};
