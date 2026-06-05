import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

const copy = TRANSLATIONS.homePremiumWelcome;

type Props = {
  onDismiss: () => void;
};

export function PremiumWelcomeBanner({ onDismiss }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const goToMatchPreferences = () => {
    onDismiss();
    router.push(ROUTES.matchPreferences);
  };

  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.banner}>
      <Pressable
        onPress={onDismiss}
        style={styles.dismissButton}
        accessibilityRole="button"
        accessibilityLabel={copy.dismiss}
        hitSlop={8}
      >
        <Ionicons name="close" size={20} color={theme.text.secondary} />
      </Pressable>

      <View style={styles.iconRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="star" size={22} color={theme.brand.primary} />
        </View>
        <AppText style={styles.title}>{copy.title}</AppText>
      </View>

      <AppText style={styles.body}>{copy.body}</AppText>
      <AppText style={styles.hint}>{copy.hint}</AppText>

      <Button
        label={copy.cta}
        type="primary"
        onPress={goToMatchPreferences}
        animated={false}
        style={styles.cta}
      />
    </Animated.View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    banner: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.brand.primarySoft,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.brand.primary,
      padding: 14,
      paddingTop: 12,
      rowGap: 10,
    },
    dismissButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      padding: 4,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
      paddingRight: 28,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.brand.primary,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
      flex: 1,
    },
    body: {
      ...text.small,
      color: theme.text.primary,
      lineHeight: 20,
    },
    hint: {
      ...text.caption,
      color: theme.text.secondary,
      lineHeight: 18,
    },
    cta: {
      marginTop: 2,
    },
  });
};
