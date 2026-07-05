import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetLocations } from '@/lib/api/queries/use-get-locations';
import {
  buildGroupedLocationItems,
  filterLocationsForSearch,
  getLocationDistrictLabel,
} from '@/lib/locations/grouped-location-options';
import { LocationDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

import { Dropdown } from './Dropdown';

type Props = {
  id: string;
  value?: number | null;
  onChange: (locationId: number | undefined) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  zIndex?: number;
};

export function LocalLocationPicker({
  id,
  value,
  onChange,
  label = '',
  placeholder = '',
  required = true,
  zIndex,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { data: locations = [] } = useGetLocations();
  const [searchText, setSearchText] = useState('');

  const filteredLocations = useMemo(
    () => filterLocationsForSearch(locations, searchText),
    [locations, searchText],
  );

  const groupedItems = useMemo(
    () => buildGroupedLocationItems(filteredLocations),
    [filteredLocations],
  );

  const itemByValue = useMemo(
    () => new Map(groupedItems.map((item) => [item.value, item])),
    [groupedItems],
  );

  const locationById = useMemo(
    () =>
      new Map(
        locations
          .filter((loc): loc is LocationDto & { id: number } => loc.id != null)
          .map((loc) => [loc.id, loc]),
      ),
    [locations],
  );

  const options = useMemo(
    () =>
      groupedItems.map((item) => ({
        label: item.label,
        value: item.value,
        disabled: item.disabled,
      })),
    [groupedItems],
  );

  const renderItem = useCallback(
    (item: { label: string; value: string }, selected?: boolean) => {
      const meta = itemByValue.get(item.value);
      if (!meta) return null;

      if (meta.kind === 'department') {
        return (
          <View style={styles.departmentRow}>
            <AppText style={styles.departmentText}>{meta.label}</AppText>
          </View>
        );
      }

      if (meta.kind === 'province') {
        return (
          <View style={styles.provinceRow}>
            <AppText style={styles.provinceText}>{meta.label}</AppText>
          </View>
        );
      }

      const location = locationById.get(Number(item.value));
      const districtLabel = location
        ? getLocationDistrictLabel(location)
        : item.label;

      return (
        <View
          style={[styles.locationRow, selected && styles.locationRowSelected]}
        >
          <AppText
            style={[
              styles.locationText,
              selected && styles.locationTextSelected,
            ]}
          >
            {districtLabel}
          </AppText>
          {selected && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={theme.brand.primary}
            />
          )}
        </View>
      );
    },
    [itemByValue, locationById, styles, theme.brand.primary],
  );

  return (
    <Dropdown
      id={id}
      placeholder={placeholder}
      label={label}
      value={value == null ? '' : String(value)}
      onChange={(nextValue) =>
        onChange(nextValue ? Number(nextValue) : undefined)
      }
      options={options}
      required={required}
      zIndex={zIndex}
      search
      searchPlaceholder="Buscar distrito..."
      onSearchChange={setSearchText}
      renderItem={renderItem}
    />
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    departmentRow: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 6,
      backgroundColor: theme.background.cardHover,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    departmentText: {
      color: theme.text.secondary,
      ...text.captionSemibold,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    provinceRow: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 6,
      paddingLeft: 20,
      backgroundColor: theme.background.cardHover,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    provinceText: {
      color: theme.text.primary,
      ...text.smallSemibold,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingLeft: 28,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    locationRowSelected: {
      backgroundColor: theme.brand.primarySoft,
    },
    locationText: {
      color: theme.text.primary,
      ...text.link,
      flex: 1,
    },
    locationTextSelected: {
      color: theme.brand.primaryLight,
    },
  });
};
