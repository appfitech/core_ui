import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { ExerciseSetDto, WorkoutSessionDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

import { useGetMonthlyWorkouts } from '../api/queries/workouts/use-get-user-workouts';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

type DayObj = { dateString: string; day: number; month: number; year: number };
const todayISO = () => new Date().toISOString().slice(0, 10);

const pad = (n: number) => String(n).padStart(2, '0');
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (iso: string) => new Date(`${iso}T00:00:00`);

function startOfWeekMonday(iso: string) {
  const d = fromISO(iso);
  const dow = d.getDay();
  const offset = (dow + 6) % 7;
  d.setDate(d.getDate() - offset);
  return toISO(d);
}
function weekDates(weekStartISO: string) {
  const start = fromISO(weekStartISO);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toISO(d);
  });
}
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

type WeeklyStats = { trainings: number; reps: number; weightKg: number };
function computeWeeklyStats(
  byDate: Record<string, WorkoutSessionDto[]>,
  weekStartISO: string,
): WeeklyStats {
  const days = weekDates(weekStartISO);
  let trainings = 0,
    reps = 0,
    weightKg = 0;
  for (const dayISO of days) {
    const sessions = byDate[dayISO] || [];
    if (sessions.length) trainings += 1;
    for (const s of sessions) {
      for (const set of (s.exerciseSets || []) as ExerciseSetDto[]) {
        const r = Number(set.repetitions || 0);
        const w = Number(set.weightKg || 0);
        reps += r;
        if (!isNaN(w)) weightKg += r * w;
      }
    }
  }
  return { trainings, reps, weightKg };
}
const fmtKg = (n: number) => `${n.toLocaleString('es-PE')}kg`;

export default function ExercisesScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);

  const [visibleYM, setVisibleYM] = useState(() => {
    const d = fromISO(selectedDate);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  const [monthData, setMonthData] = useState<
    Record<string, WorkoutSessionDto[]>
  >({});

  const { y, m } = visibleYM;
  const { start, end } = monthRange(y, m);

  const {
    data: monthlyData,
    isLoading,
    refetch,
  } = useGetMonthlyWorkouts(start, end);

  useFocusEffect(
    useCallback(() => {
      // When screen gets focus, refetch the current month
      refetch();
    }, [refetch, start, end]),
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
      selectedColor: theme.backgroundInverted,
      selectedTextColor: theme.dark100,
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

  const weekStart = useMemo(
    () => startOfWeekMonday(selectedDate),
    [selectedDate],
  );
  const prevWeekStart = useMemo(() => {
    const d = fromISO(weekStart);
    d.setDate(d.getDate() - 7);
    return toISO(d);
  }, [weekStart]);

  const currentStats = useMemo(
    () => computeWeeklyStats(monthData, weekStart),
    [monthData, weekStart],
  );
  const prevStats = useMemo(
    () => computeWeeklyStats(monthData, prevWeekStart),
    [monthData, prevWeekStart],
  );

  return (
    <PageContainer
      header={'Mi Registro de Entrenamientos'}
      subheader={'Lleva el control de tus workouts y alcanza tus metas fitness'}
      style={{ padding: 16 }}
    >
      <View style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden' }}>
        <Calendar
          onDayPress={(d: DayObj) => handleOpenDay(d.dateString)}
          onMonthChange={(m: any) => setVisibleYM({ y: m.year, m: m.month })}
          markedDates={markedDates}
          firstDay={1}
          enableSwipeMonths
          theme={calendarTheme(theme)}
          maxDate={todayISO()}
          dayComponent={({ date, state }) => {
            const ds = date?.dateString as string;
            const count = monthData[ds]?.length || 0;
            const isSelected = ds === selectedDate;
            const isDisabled = state === 'disabled';
            const hasWorkoutBg =
              count > 0 ? 'rgba(91, 194, 54, 0.15)' : 'transparent';
            const textColor = isSelected
              ? theme.dark100
              : isDisabled
                ? (theme.dark300 ?? '#A0A0A0')
                : theme.textPrimary;
            const dots = Array(Math.min(count, 3))
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    marginHorizontal: 2,
                    backgroundColor: isSelected
                      ? theme.dark100
                      : (theme.success ?? theme.backgroundInverted),
                  }}
                />
              ));
            return (
              <TouchableOpacity
                style={{ paddingVertical: 4, paddingHorizontal: 2 }}
                onPress={() => handleOpenDay(ds)}
                disabled={isDisabled}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 6,
                    borderRadius: 8,
                    backgroundColor: isSelected
                      ? theme.backgroundInverted
                      : hasWorkoutBg,
                  }}
                >
                  <AppText
                    style={{
                      textAlign: 'center',
                      fontWeight: isSelected ? '700' : '400',
                      color: textColor,
                    }}
                  >
                    {date.day}
                  </AppText>
                  {count > 0 && (
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                      {dots}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.compareCard}>
        <AppText style={styles.compareTitle}>
          Comparación con Semana Anterior
        </AppText>
        <View style={styles.metricPanel}>
          <AppText style={styles.metricHeading}>Entrenamientos</AppText>
          <View style={styles.metricRow}>
            <AppText style={styles.metricCurrent}>
              {currentStats.trainings}
            </AppText>
            <AppText style={styles.arrow}> → </AppText>
            <AppText style={styles.metricPrev}>{prevStats.trainings}</AppText>
          </View>
        </View>
        <View style={styles.metricPanel}>
          <AppText style={styles.metricHeading}>Repeticiones</AppText>
          <View style={styles.metricRow}>
            <AppText style={styles.metricCurrent}>{currentStats.reps}</AppText>
            <AppText style={styles.arrow}> → </AppText>
            <AppText style={styles.metricPrev}>{prevStats.reps}</AppText>
          </View>
        </View>
        <View style={styles.metricPanel}>
          <AppText style={styles.metricHeading}>Peso Movido</AppText>
          <View style={styles.metricRow}>
            <AppText style={styles.metricCurrent}>
              {fmtKg(currentStats.weightKg)}
            </AppText>
            <AppText style={styles.arrow}> → </AppText>
            <AppText style={styles.metricPrev}>
              {fmtKg(prevStats.weightKg)}
            </AppText>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}

const calendarTheme = (theme: FullTheme) => ({
  backgroundColor: theme.dark100,
  calendarBackground: theme.dark100,
  textSectionTitleColor: theme.textSecondary,
  selectedDayBackgroundColor: theme.backgroundInverted,
  selectedDayTextColor: theme.dark100,
  todayTextColor: theme.primary ?? theme.backgroundInverted,
  dayTextColor: theme.textPrimary,
  textDisabledColor: theme.secondary ?? '#A0A0A0',
  dotColor: theme.primary ?? theme.backgroundInverted,
  selectedDotColor: theme.dark100,
  arrowColor: theme.textPrimary,
  monthTextColor: theme.textPrimary,
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 12,
});

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    compareCard: {
      marginTop: 16,
      borderRadius: 12,
      backgroundColor: theme.infoBackground,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E6E6E6',
      marginBottom: 100,
    },
    compareTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
    metricPanel: {
      backgroundColor: '#F7F7F7',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginTop: 10,
    },
    metricHeading: { textAlign: 'center', fontWeight: '700', marginBottom: 6 },
    metricRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    metricCurrent: { color: '#1A73E8', fontWeight: '800', fontSize: 18 },
    arrow: {
      marginHorizontal: 8,
      fontSize: 16,
      opacity: 0.8,
      color: '#F39C12',
    },
    metricPrev: { color: theme.textSecondary, fontSize: 18, fontWeight: '700' },
    ...HEADING_STYLES(theme),
  });
