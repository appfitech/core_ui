import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HomeSectionContainer } from '@/components/HomeSectionContainer';
import { HomeCarouselSkeleton } from '@/components/home/skeletons/HomeCarouselSkeleton';
import { UserActivityPromoCard } from '@/components/modules/UserActivityPromoCard';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import { useGetRoutines } from '@/lib/api/queries/use-get-routines';
import { pickFeaturedActivities } from '@/lib/list/pick-featured-activities';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { isDietResourceType } from '@/utils/resources';

const FEATURED_ACTIVITY_LIMIT = 3;
const CARD_GAP = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.6);
const CARD_HEIGHT = 228;

export function UserActivitiesSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userActivitiesSection: t } = TRANSLATIONS;
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: routines, isLoading: routinesLoading } = useGetRoutines();
  const { data: diets, isLoading: dietsLoading } = useGetDiets();
  const isLoading = routinesLoading || dietsLoading;

  const activities = useMemo(
    () => pickFeaturedActivities(routines, diets, FEATURED_ACTIVITY_LIMIT),
    [routines, diets],
  );

  const snapInterval = CARD_WIDTH + CARD_GAP;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      setActiveIndex(Math.min(index, Math.max(activities.length - 1, 0)));
    },
    [activities.length, snapInterval],
  );

  const handleActivityClick = useCallback(
    (item: ClientResourceResponseDtoReadable) => {
      if (isDietResourceType(item?.resourceType)) {
        router.push(`${ROUTES.diets}/${item.id}`);
        return;
      }

      router.push(`${ROUTES.routines}/${item.id}`);
    },
    [router],
  );

  const handleFindTrainers = useCallback(() => {
    router.push(ROUTES.trainers);
  }, [router]);

  if (isLoading) {
    return (
      <HomeSectionContainer
        title={t.sectionTitle}
        onClick={() => router.push(ROUTES.workouts)}
      >
        <HomeCarouselSkeleton
          cardWidth={CARD_WIDTH}
          cardHeight={CARD_HEIGHT}
          gap={CARD_GAP}
        />
      </HomeSectionContainer>
    );
  }

  if (activities.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <AppText style={styles.emptyTitle}>{t.emptyTitle}</AppText>
        <AppText style={styles.emptyBody}>{t.emptyBody}</AppText>
        <Button
          label={t.findTrainersButton}
          onPress={handleFindTrainers}
          type="secondary"
          animated={false}
        />
      </Card>
    );
  }

  return (
    <HomeSectionContainer
      title={t.sectionTitle}
      onClick={() => router.push(ROUTES.workouts)}
    >
      <FlatList
        data={activities}
        keyExtractor={(item, index) => `activity-${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <UserActivityPromoCard
            item={item}
            width={CARD_WIDTH}
            onPress={() => handleActivityClick(item)}
          />
        )}
      />

      {activities.length > 1 ? (
        <View style={styles.dots}>
          {activities.map((item, index) => (
            <View
              key={`activity-dot-${item.id}-${index}`}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </HomeSectionContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    listContent: {
      columnGap: CARD_GAP,
      paddingRight: 4,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      columnGap: 6,
      marginTop: 12,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.border.default,
    },
    dotActive: {
      width: 18,
      backgroundColor: theme.brand.primary,
    },
    emptyCard: {
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderRadius: 12,
      rowGap: 12,
    },
    emptyTitle: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    emptyBody: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
  });
};
