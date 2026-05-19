import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import DietSVG from '@/assets/images/vectors/diet.svg';
import RoutineSVG from '@/assets/images/vectors/routine.svg';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HomeSectionContainer } from '@/components/HomeSectionContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetDiets } from '@/lib/api/queries/use-get-diets';
import { useGetRoutines } from '@/lib/api/queries/use-get-routines';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import { isDietResourceType } from '@/utils/resources';

function isValidActivity(
  item: ClientResourceResponseDtoReadable | undefined,
): item is ClientResourceResponseDtoReadable {
  return item?.id != null;
}

export function UserActivitiesSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userActivitiesSection: t } = TRANSLATIONS;

  const { data: routines, isLoading: routinesLoading } = useGetRoutines();
  const { data: diets, isLoading: dietsLoading } = useGetDiets();
  const isLoading = routinesLoading || dietsLoading;

  const activities = useMemo(() => {
    const items: ClientResourceResponseDtoReadable[] = [];
    const firstRoutine = routines?.[0];
    const firstDiet = diets?.[0];
    if (isValidActivity(firstRoutine)) {
      items.push(firstRoutine);
    }
    if (isValidActivity(firstDiet)) {
      items.push(firstDiet);
    }
    return items;
  }, [routines, diets]);

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
    return null;
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
      <View style={styles.row}>
        {activities.map((item, index) => {
          const isDiet = isDietResourceType(item.resourceType);
          const SVGIcon = isDiet ? DietSVG : RoutineSVG;

          return (
            <TouchableOpacity
              key={`activity-${item.id}-${index}`}
              onPress={() => handleActivityClick(item)}
              style={styles.activityItem}
            >
              <Card style={styles.card}>
                <View style={styles.iconWrapper}>
                  <SVGIcon width={75} height={75} />
                </View>
                <View style={styles.cardText}>
                  <AppText style={styles.cardTitle}>
                    {item.resourceName?.split('-')?.[0]}
                  </AppText>
                  {item.trainerName && (
                    <AppText style={styles.cardSubBold}>
                      {`${t.trainerLabel} ${item.trainerName}`}
                    </AppText>
                  )}
                </View>
                <View style={styles.tagWrap}>
                  <Tag
                    label={item.resourceType ?? ''}
                    textColor={theme.background.app}
                    backgroundColor={
                      isDiet
                        ? theme.brand.primaryLight
                        : theme.brand.primaryDark
                    }
                  />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </HomeSectionContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      columnGap: 16,
    },
    activityItem: {
      flex: 1,
    },
    card: {
      backgroundColor: theme.background.elevated,
      flex: 1,
      rowGap: 8,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    cardTitle: {
      ...text.leadSemibold,
      color: theme.text.primary,
    },
    cardSubBold: {
      ...text.bodySemibold,
      color: theme.text.secondary,
    },
    cardText: {
      rowGap: 6,
      flex: 1,
    },
    tagWrap: {
      alignSelf: 'flex-end',
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    emptyCard: {
      backgroundColor: theme.background.elevated,
      borderWidth: 1,
      borderColor: theme.border.default,
      rowGap: 12,
    },
    emptyTitle: {
      ...text.leadSemibold,
      color: theme.text.primary,
    },
    emptyBody: {
      ...text.body,
      color: theme.text.secondary,
      lineHeight: 22,
    },
  });
};
