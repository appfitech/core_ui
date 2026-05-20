import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';
import { ProductFeatureCard } from '@/components/ProductFeatureCard';
import { getVisiblePremiumFeatures } from '@/constants/premium-features';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetUserMatchPreferences } from '@/lib/api/queries/use-get-user-match-preferences';
import { FullTheme } from '@/types/theme';

export default function PremiumFeaturesScreen() {
  const { theme } = useTheme();
  const { data: matchPreferences } = useGetUserMatchPreferences();
  const styles = getStyles(theme);
  const { premiumFeaturesScreen: copy } = TRANSLATIONS;

  const visibleFeatures = getVisiblePremiumFeatures(matchPreferences);

  return (
    <PageContainer
      hasBackButton={false}
      title={copy.title}
      subheader={copy.subheader}
      style={styles.pageStyle}
      contentPaddingBottom={220}
    >
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="star" size={16} color={theme.status.warning.icon} />
          <AppText style={styles.heroBadgeText}>{copy.badge}</AppText>
        </View>
      </View>

      <View style={styles.cardList}>
        {visibleFeatures.map((feature, index) => {
          const featureCopy = copy.features[feature.id];
          const onPress = feature.route
            ? () => router.push(feature.route as Href)
            : undefined;

          return (
            <Animated.View
              key={feature.id}
              entering={FadeInUp.delay(50 * index).duration(260)}
            >
              <ProductFeatureCard
                title={featureCopy.title}
                description={featureCopy.description}
                image={feature.image}
                onPress={onPress}
              />
            </Animated.View>
          );
        })}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    pageStyle: {
      rowGap: 8,
    },
    hero: {
      alignItems: 'flex-end',
      paddingVertical: 4,
      paddingHorizontal: 4,
      marginTop: 4,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.status.warning.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      gap: 6,
    },
    heroBadgeText: {
      ...text.captionSemibold,
      color: theme.status.warning.text,
    },
    cardList: {
      rowGap: 12,
      paddingTop: 4,
    },
  });
};
