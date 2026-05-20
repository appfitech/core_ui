import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { FeaturedTrainerCarouselCard } from '@/components/modules/FeaturedTrainerCarouselCard';
import { HomeSectionContainer } from '@/components/HomeSectionContainer';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchTrainers } from '@/lib/api/mutations/use-search-trainers';
import { useUserStore } from '@/stores/user';
import { PublicTrainerDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

const FEATURED_TRAINER_LIMIT = 3;
const CARD_GAP = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(280, SCREEN_WIDTH * 0.78);

export function UserFavoriteTrainersSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { featuredTrainersSection: copy } = TRANSLATIONS;
  const token = useUserStore((s) => s.getToken());

  const [trainers, setTrainers] = useState<PublicTrainerDtoReadable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const { mutate: searchTrainers } = useSearchTrainers();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    searchTrainers(
      { query: '' },
      {
        onSuccess: (data) => {
          setTrainers(data ?? []);
          setIsLoading(false);
        },
        onError: () => setIsLoading(false),
      },
    );
  }, [token, searchTrainers]);

  const featuredTrainers = useMemo(
    () => trainers.slice(0, FEATURED_TRAINER_LIMIT),
    [trainers],
  );

  const snapInterval = CARD_WIDTH + CARD_GAP;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      setActiveIndex(Math.min(index, featuredTrainers.length - 1));
    },
    [featuredTrainers.length, snapInterval],
  );

  const handleTrainerPress = useCallback(
    (trainerId?: number) => {
      if (trainerId == null) return;
      router.push(`${ROUTES.trainers}/${trainerId}`);
    },
    [router],
  );

  if (isLoading || featuredTrainers.length === 0) {
    return null;
  }

  return (
    <HomeSectionContainer
      title={copy.title}
      onClick={() => router.push(ROUTES.trainers)}
    >
      <FlatList
        data={featuredTrainers}
        keyExtractor={(item, index) =>
          `featured-trainer-${item.id ?? index}`
        }
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
          <FeaturedTrainerCarouselCard
            trainer={item}
            width={CARD_WIDTH}
            onPress={() => handleTrainerPress(item.id)}
          />
        )}
      />

      {featuredTrainers.length > 1 ? (
        <View style={styles.dots}>
          {featuredTrainers.map((trainer, index) => (
            <View
              key={`dot-${trainer.id ?? index}`}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      ) : null}
    </HomeSectionContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
  });
