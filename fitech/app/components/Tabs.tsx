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

import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { FullTheme } from '@/types/theme';
import { rippleFromHex } from '@/utils/theme';

import { AppText } from './AppText';

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
  }, [selectedIndex, options.length]);

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
                ? { color: rippleFromHex(theme.info, 0.2) }
                : undefined
            }
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <AppText
              style={[
                styles.tabText,
                isSelected ? styles.textSelected : undefined,
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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    tabsWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.infoBackground,
    },
    pill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: 16,
      backgroundColor: theme.info,
    },
    tab: {
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabPressed: {
      opacity: 0.88,
    },
    tabText: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    textSelected: {
      color: theme.dark100,
      fontWeight: 800,
    },
  });
