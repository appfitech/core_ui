import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useGetDiets } from '@/app/api/queries/use-get-diets';
import { useGetRoutines } from '@/app/api/queries/use-get-routines';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

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

  const activities = useMemo(
    () => [{ ...routines?.[0] }, { ...diets?.[0] }],
    [routines, diets],
  );

  return (
    <HomeSectionContainer
      title="Mis actividades"
      onClick={() => router.push(ROUTES.workouts)}
    >
      <View style={{ flexDirection: 'row', columnGap: 10 }}>
        {activities?.map((item, index) => (
          <Card key={`activity-${item?.id}-${index}`} style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push(`${ROUTES.routines}/${item.id}`)}
            >
              <View style={styles.iconWrapper}>
                <RoutineSVG width={75} height={75} />
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
                  backgroundColor={theme.backgroundInverted}
                />
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    </HomeSectionContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.dark200,
      flex: 1,
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
