import React, { useEffect } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { AppTheme } from '@/types/theme';
import { rippleFromHex } from '@/utils/theme';

import { AppText } from './AppText';

const TRACK_INSET = 4;

type Props = {
  options: Option[];
  value: string;
  onSelect: React.Dispatch<React.SetStateAction<any>>;
};

export function Tabs({ options, value, onSelect }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const containerWidthSV = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w && w !== containerWidthSV.value) {
      containerWidthSV.value = w;
      const tabW = w / Math.max(1, options.length);
      indicatorX.value = tabW * selectedIndex;
    }
  };

  useEffect(() => {
    const tabW = containerWidthSV.value / Math.max(1, options.length);
    indicatorX.value = withTiming(tabW * selectedIndex, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [selectedIndex, options.length, containerWidthSV, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => {
    const tabW = containerWidthSV.value / Math.max(1, options.length);
    return {
      width: tabW || 0,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  return (
    <View style={styles.tabsWrapper} onLayout={onLayout}>
      <Animated.View style={[styles.pill, indicatorStyle]} />
      {options.map(({ label, value: optValue }) => {
        const isSelected = value === optValue;

        return (
          <Pressable
            key={optValue}
            onPress={() => onSelect(optValue)}
            android_ripple={
              Platform.OS === 'android'
                ? { color: rippleFromHex(theme.brand.primary, 0.25) }
                : undefined
            }
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <AppText
              style={[
                styles.tabText,
                isSelected && styles.tabTextSelected,
              ]}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    tabsWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      overflow: 'hidden',
      padding: TRACK_INSET,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    pill: {
      position: 'absolute',
      left: 0,
      top: TRACK_INSET,
      bottom: TRACK_INSET,
      borderRadius: 999,
      backgroundColor: theme.brand.primary,
    },
    tab: {
      flex: 1,
      height: 44,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabPressed: {
      opacity: 0.88,
    },
    tabText: {
      ...text.bodyMedium,
      color: theme.text.secondary,
    },
    tabTextSelected: {
      ...text.bodySemibold,
      color: theme.text.inverse,
    },
  });
};
