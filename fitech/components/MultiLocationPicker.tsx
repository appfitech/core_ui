import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGetLocations } from '@/lib/api/queries/use-get-locations';
import {
  buildGroupedLocationItems,
  filterLocationsForSearch,
  getLocationDepartmentLabel,
  getLocationDistrictLabel,
  getLocationOptionLabel,
} from '@/lib/locations/grouped-location-options';
import { LocationDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

type Props = {
  label?: string;
  placeholder?: string;
  selected: LocationDto[];
  onChange: (locations: LocationDto[]) => void;
};

export function MultiLocationPicker({
  label,
  placeholder = 'Agregar ubicación',
  selected,
  onChange,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { data: locations = [] } = useGetLocations();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedIds = useMemo(
    () => new Set(selected.map((l) => l.id).filter((id) => id != null)),
    [selected],
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

  const filteredLocations = useMemo(
    () => filterLocationsForSearch(locations, searchText),
    [locations, searchText],
  );

  const groupedItems = useMemo(
    () => buildGroupedLocationItems(filteredLocations),
    [filteredLocations],
  );

  const toggleLocation = useCallback(
    (locationId: number) => {
      const loc = locationById.get(locationId);
      if (!loc) return;

      if (selectedIds.has(locationId)) {
        onChange(selected.filter((x) => x.id !== locationId));
      } else {
        onChange([...selected, loc]);
      }
    },
    [locationById, onChange, selected, selectedIds],
  );

  const removeLocation = useCallback(
    (locationId: number) => {
      onChange(selected.filter((x) => x.id !== locationId));
    },
    [onChange, selected],
  );

  const closeModal = () => {
    setSearchText('');
    setOpen(false);
  };

  return (
    <View style={styles.wrap}>
      {label ? <AppText style={styles.fieldLabel}>{label}</AppText> : null}

      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <AppText style={styles.triggerText}>
          {selected.length > 0
            ? `${selected.length} distrito${selected.length === 1 ? '' : 's'} seleccionado${selected.length === 1 ? '' : 's'}`
            : placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={18} color={theme.text.tertiary} />
      </Pressable>

      {selected.length > 0 ? (
        <View style={styles.chipsRow}>
          {selected.map((loc) => {
            if (loc.id == null) return null;
            return (
              <Pressable
                key={loc.id}
                style={styles.chip}
                onPress={() => removeLocation(loc.id!)}
              >
                <AppText style={styles.chipText}>
                  {getLocationOptionLabel(loc)}
                </AppText>
                <Ionicons name="close" size={14} color={theme.brand.primary} />
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Modal transparent visible={open} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Selecciona distritos</AppText>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={theme.text.tertiary} />
              <RNTextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar distrito..."
                placeholderTextColor={theme.text.tertiary}
                style={styles.searchInput}
              />
            </View>

            <ScrollView style={styles.modalScroll}>
              {groupedItems.map((item) => {
                if (item.kind === 'department') {
                  return (
                    <View key={item.value} style={styles.departmentRow}>
                      <AppText style={styles.departmentText}>
                        {item.label}
                      </AppText>
                    </View>
                  );
                }

                if (item.kind === 'province') {
                  return (
                    <View key={item.value} style={styles.provinceRow}>
                      <AppText style={styles.provinceText}>
                        {item.label}
                      </AppText>
                    </View>
                  );
                }

                const locationId = Number(item.value);
                const location = locationById.get(locationId);
                const isSelected = selectedIds.has(locationId);
                const districtLabel = location
                  ? getLocationDistrictLabel(location)
                  : item.label;
                const departmentLabel = location
                  ? getLocationDepartmentLabel(location)
                  : '';
                const showDepartment =
                  !!departmentLabel &&
                  departmentLabel.localeCompare(districtLabel, 'es', {
                    sensitivity: 'base',
                  }) !== 0;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => toggleLocation(locationId)}
                    style={[
                      styles.locationRow,
                      isSelected && styles.locationRowSelected,
                    ]}
                  >
                    <View style={styles.locationTextWrap}>
                      <AppText
                        style={[
                          styles.locationText,
                          isSelected && styles.locationTextSelected,
                        ]}
                      >
                        {districtLabel}
                      </AppText>
                      {showDepartment ? (
                        <AppText
                          style={[
                            styles.locationContext,
                            isSelected && styles.locationContextSelected,
                          ]}
                        >
                          {departmentLabel}
                        </AppText>
                      ) : null}
                    </View>
                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.brand.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Button label="Listo" onPress={closeModal} style={styles.doneBtn} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    wrap: {
      rowGap: 8,
    },
    fieldLabel: {
      ...text.caption,
      color: theme.text.tertiary,
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: theme.background.input,
    },
    triggerText: {
      ...text.small,
      color: theme.text.secondary,
      flex: 1,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.brand.primarySoft,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    chipText: {
      ...text.smallSemibold,
      color: theme.brand.primary,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      borderRadius: 16,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 16,
      maxHeight: '80%',
    },
    modalTitle: {
      ...text.linkSemibold,
      color: theme.text.primary,
      marginBottom: 12,
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      backgroundColor: theme.background.input,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      ...text.small,
      color: theme.text.primary,
      paddingVertical: 10,
    },
    modalScroll: {
      maxHeight: 360,
    },
    departmentRow: {
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 4,
    },
    departmentText: {
      ...text.captionSemibold,
      color: theme.text.tertiary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    provinceRow: {
      paddingHorizontal: 12,
      paddingLeft: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    provinceText: {
      ...text.smallSemibold,
      color: theme.text.secondary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingLeft: 20,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border.default,
    },
    locationRowSelected: {
      backgroundColor: theme.brand.primarySoft,
    },
    locationTextWrap: {
      flex: 1,
      rowGap: 2,
    },
    locationText: {
      ...text.small,
      color: theme.text.primary,
    },
    locationTextSelected: {
      color: theme.brand.primary,
      ...text.smallSemibold,
    },
    locationContext: {
      color: theme.text.tertiary,
      ...text.caption,
    },
    locationContextSelected: {
      color: theme.brand.primary,
    },
    doneBtn: {
      marginTop: 12,
    },
  });
};
