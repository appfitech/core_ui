import { LocaleConfig } from 'react-native-calendars';

import type { AppTheme } from '@/types/theme';

let localeConfigured = false;

/** Spanish labels for `react-native-calendars` (idempotent). */
export function ensureSpanishCalendarLocale() {
  if (localeConfigured) return;

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
  localeConfigured = true;
}

export function getCalendarTheme(theme: AppTheme) {
  return {
    backgroundColor: theme.background.card,
    calendarBackground: theme.background.card,
    textSectionTitleColor: theme.text.secondary,
    selectedDayBackgroundColor: theme.brand.primary,
    selectedDayTextColor: theme.background.app,
    todayTextColor: theme.brand.primary,
    dayTextColor: theme.text.primary,
    textDisabledColor: theme.text.tertiary,
    dotColor: theme.brand.primary,
    selectedDotColor: theme.background.app,
    arrowColor: theme.text.primary,
    monthTextColor: theme.text.primary,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 12,
  };
}
