import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useGetDiets } from '@/app/api/queries/use-get-diets';
import { useGetRoutines } from '@/app/api/queries/use-get-routines';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { ClientResourceResponseDtoReadable } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import DietSVG from '../../../assets/images/vectors/diet.svg';
import RoutineSVG from '../../../assets/images/vectors/routine.svg';
import { AppText } from '../AppText';
import { Card } from '../Card';
import { HomeSectionContainer } from '../HomeSectionContainer';
import { Tag } from '../Tag';

export function UserActivitiesSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { data: routines } = useGetRoutines();
  const { data: diets } = useGetDiets();

  const activities: ClientResourceResponseDtoReadable[] = useMemo(
    () => [{ ...routines?.[0] }, { ...diets?.[0] }],
    [routines, diets],
  );

  const handleActivityClick = useCallback(
    (item: ClientResourceResponseDtoReadable) => {
      if (item?.resourceType === 'DIETA' || item?.resourceType === 'DIET') {
        router.push(`${ROUTES.diets}/${item.id}`);
        return;
      }

      router.push(`${ROUTES.routines}/${item.id}`);
    },
    [],
  );

  return (
    <HomeSectionContainer
      title="Mis actividades"
      onClick={() => router.push(ROUTES.workouts)}
    >
      <View style={{ flexDirection: 'row', columnGap: 16 }}>
        {activities?.map((item, index) => {
          const isDiet =
            item?.resourceType === 'DIETA' || item?.resourceType === 'DIET';
          const SVGIcon = isDiet ? DietSVG : RoutineSVG;

          return (
            <TouchableOpacity
              key={`activity-${item?.id}-${index}`}
              onPress={() => handleActivityClick(item)}
              style={{ flex: 1 }}
            >
              <Card style={styles.card}>
                <View style={styles.iconWrapper}>
                  <SVGIcon width={75} height={75} />
                </View>
                <View style={{ rowGap: 6, flex: 1 }}>
                  <AppText style={styles.cardTitle}>
                    {item?.resourceName?.split('-')?.[0]}
                  </AppText>

                  <AppText style={styles.cardSubBold}>
                    {`Entrenador: ${item?.trainerName}`}
                  </AppText>
                </View>
                <View style={{ alignSelf: 'flex-end' }}>
                  <Tag
                    label={item.resourceType ?? ''}
                    textColor={theme.background}
                    backgroundColor={isDiet ? theme.green600 : theme.green800}
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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.dark200,
      flex: 1,
      rowGap: 8,
    },
    cardTitle: {
      fontWeight: '600',
      fontSize: 17,
      color: theme.textPrimary,
    },
    cardSub: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    cardSubBold: {
      color: theme.textSecondary,
      fontWeight: '700',
    },
    iconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
  });
