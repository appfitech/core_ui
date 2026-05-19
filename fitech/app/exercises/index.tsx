import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { AppText } from '@/components/AppText';
import { ChipsList } from '@/components/molecules/ChipsList';
import PageContainer from '@/components/PageContainer';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetMuscleGroups } from '@/lib/api/queries/use-get-muscle-groups';
import { useGetWorkoutsFiltered } from '@/lib/api/queries/workouts/use-get-user-workouts';
import { WorkoutSessionDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';
import {
  ensureSpanishCalendarLocale,
  getCalendarTheme,
} from '@/utils/calendar';

ensureSpanishCalendarLocale();

type DayObj = { dateString: string; day: number; month: number; year: number };
const todayISO = moment().format('YYYY-MM-DD');

const pad = (n: number) => String(n).padStart(2, '0');
const fromISO = (iso: string) => new Date(`${iso}T00:00:00`);

const monthRange = (year: number, month1to12: number) => {
  const start = `${year}-${pad(month1to12)}-01`;
  const lastDay = new Date(year, month1to12, 0).getDate();
  const end = `${year}-${pad(month1to12)}-${pad(lastDay)}`;
  return { start, end };
};

// Map YYYY-MM-DD -> sessions[]
const groupByDate = (arr: WorkoutSessionDto[]) => {
  const m: Record<string, WorkoutSessionDto[]> = {};
  for (const s of arr || []) {
    const k = s.workoutDate as string;
    if (!k) continue;
    (m[k] ||= []).push(s);
  }
  return m;
};

export default function ExercisesScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { data: muscleGroups } = useGetMuscleGroups();

  const [visibleYM, setVisibleYM] = useState(() => {
    const d = fromISO(selectedDate);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  const [monthData, setMonthData] = useState<
    Record<string, WorkoutSessionDto[]>
  >({});

  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string[]>([]);

  const { y, m } = visibleYM;
  const { start, end } = monthRange(y, m);

  const {
    data: monthlyData,
    isLoading,
    refetch,
  } = useGetWorkoutsFiltered({ start, end, muscleGroups: muscleGroupFilter });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (!isLoading && monthlyData) {
      setMonthData(groupByDate(monthlyData || []));
    }
  }, [monthlyData, isLoading]);

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    marked[selectedDate] = {
      ...(marked[selectedDate] ?? {}),
      selected: true,
      selectedColor: theme.brand.primary,
      selectedTextColor: theme.background.app,
    };
    return marked;
  }, [selectedDate, theme]);

  const handleOpenDay = (dateString: string) => {
    setSelectedDate(dateString);
    router.push({
      pathname: '/exercises/[date]',
      params: { date: dateString },
    });
  };

  return (
    <PageContainer
      title="Mi Registro de Entrenamientos"
      subheader="Lleva el control de tus workouts y alcanza tus metas fitness"
      style={styles.pageStyle}
    >
      <View style={styles.filterCard}>
        <AppText style={styles.filterTitle}>Filtro por grupo muscular</AppText>
        <AppText style={styles.filterHint}>
          Toca un grupo para filtrar los entrenamientos del mes
        </AppText>
        <ChipsList
          selectedValues={muscleGroupFilter}
          onChange={setMuscleGroupFilter}
          options={
            muscleGroups?.map((item) => ({ label: item, value: item })) ?? []
          }
        />
      </View>

      <View style={styles.calendarCard}>
        <Calendar
          onDayPress={(d: DayObj) => handleOpenDay(d.dateString)}
          onMonthChange={(m: any) => setVisibleYM({ y: m.year, m: m.month })}
          markedDates={markedDates}
          firstDay={1}
          enableSwipeMonths
          theme={getCalendarTheme(theme)}
          maxDate={todayISO}
          dayComponent={({
            date,
            state,
          }: {
            date?: DateData;
            state?: string;
          }) => {
            const ds = date?.dateString as string;
            const count = monthData[ds]?.length || 0;
            const isSelected = ds === selectedDate;
            const isDisabled = state === 'disabled';
            const hasWorkout = count > 0;
            const textColor = isSelected
              ? theme.background.app
              : isDisabled
                ? theme.text.tertiary
                : theme.text.primary;
            const dots = Array(Math.min(count, 3))
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dayDot,
                    {
                      backgroundColor: isSelected
                        ? theme.background.app
                        : theme.brand.primary,
                    },
                  ]}
                />
              ));
            return (
              <TouchableOpacity
                style={styles.dayTouchable}
                onPress={() => handleOpenDay(ds)}
                disabled={isDisabled}
              >
                <View
                  style={[
                    styles.dayInner,
                    {
                      backgroundColor: isSelected
                        ? theme.brand.primary
                        : hasWorkout
                          ? theme.brand.primarySoft
                          : 'transparent',
                    },
                  ]}
                >
                  <AppText
                    style={[
                      isSelected ? styles.dayTextSelected : styles.dayText,
                      { color: textColor },
                    ]}
                  >
                    {date?.day ?? ''}
                  </AppText>
                  {count > 0 && <View style={styles.dotsRow}>{dots}</View>}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: { paddingBottom: 180 },
    filterCard: {
      backgroundColor: theme.background.input,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.brand.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 16,
      rowGap: 8,
    },
    filterTitle: {
      ...text.bodySemibold,
      color: theme.brand.primaryLight,
    },
    filterHint: {
      ...text.caption,
      color: theme.text.secondary,
      marginTop: -2,
    },
    calendarCard: {
      marginTop: 20,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 12,
    },
    dayTouchable: { paddingVertical: 6, paddingHorizontal: 2 },
    dayInner: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    dayText: { ...text.link, textAlign: 'center' },
    dayTextSelected: { ...text.linkSemibold, textAlign: 'center' },
    dotsRow: { flexDirection: 'row', marginTop: 4, columnGap: 2 },
    dayDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
  });
};
