import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

type Props = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress?: () => void;
};

export function ProductFeatureCard({
  title,
  description,
  image,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={image} style={styles.illustration} resizeMode="contain" />

      <View style={styles.body}>
        <AppText style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        <AppText style={styles.description}>{description}</AppText>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.text.tertiary}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      minHeight: 112,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.card,
      overflow: 'hidden',
      columnGap: 12,
    },
    cardPressed: {
      opacity: 0.88,
      backgroundColor: theme.background.input,
    },
    body: {
      flex: 1,
      minWidth: 0,
      rowGap: 4,
      paddingVertical: 12,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    description: {
      ...text.small,
      color: theme.text.secondary,
    },
    illustration: {
      width: 112,
      height: 112,
      opacity: 0.95,
    },
    chevron: {
      paddingHorizontal: 12,
    },
  });
};
