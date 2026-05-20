import { type Href, router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import PageContainer from '@/components/PageContainer';
import { ProductFeatureCard } from '@/components/ProductFeatureCard';
import { TRANSLATIONS } from '@/constants/strings';
import { getWorkoutsPanelRows } from '@/constants/workouts-panel';
import { useUserStore } from '@/stores/user';

export default function WorkoutsScreen() {
  const isTrainer = useUserStore((s) => s.getIsTrainer());
  const panelRows = getWorkoutsPanelRows(isTrainer);
  const copy = isTrainer
    ? TRANSLATIONS.workoutsScreen.trainer
    : TRANSLATIONS.workoutsScreen.client;

  return (
    <PageContainer
      hasBackButton={false}
      title={copy.title}
      subheader={copy.subheader}
      style={{ paddingBottom: 150 }}
    >
      <View style={styles.cardList}>
        {panelRows.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInUp.delay(50 * index).duration(260)}
          >
            <ProductFeatureCard
              title={item.title}
              description={item.description}
              image={item.image}
              onPress={() => router.push(item.route as Href)}
            />
          </Animated.View>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  cardList: {
    rowGap: 12,
    paddingTop: 4,
  },
});
