import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Dropdown as DropdownElement } from 'react-native-element-dropdown';

import { formStyles } from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type DropdownItem = {
  label: string;
  value: string;
};

export type Props = {
  options: Option[];
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  zIndex?: number;
  id?: string;
  label?: string;
  search?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
};

export function Dropdown({
  options,
  onChange,
  value,
  zIndex = 1,
  placeholder = 'Seleccione',
  id = '',
  label = '',
  search,
  disabled = false,
  searchPlaceholder = 'Buscar...',
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const data = useMemo<DropdownItem[]>(
    () =>
      options.map((option) => ({
        label: option.label,
        value: String(option.value),
      })),
    [options],
  );

  const selectedValue =
    value === null || value === undefined || value === ''
      ? null
      : String(value);

  const enableSearch = search ?? data.length > 6;

  return (
    <View key={id || 'dropdown'} style={{ zIndex }}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <DropdownElement
        disable={disabled}
        data={data}
        labelField="label"
        valueField="value"
        value={selectedValue}
        search={enableSearch}
        searchPlaceholder={searchPlaceholder}
        onChange={(item: DropdownItem) => {
          onChange(item.value);
        }}
        placeholder={placeholder}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        selectedTextProps={{ numberOfLines: 1 }}
        containerStyle={styles.listContainer}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        activeColor={theme.primaryBg}
        inputSearchStyle={styles.searchInput}
        searchPlaceholderTextColor={theme.dark700}
        iconColor={theme.icon}
        renderRightIcon={() => (
          <Ionicons name="chevron-down" size={20} color={theme.icon} />
        )}
        renderItem={(item: DropdownItem, selected?: boolean) => (
          <View style={[styles.itemRow, selected && styles.itemRowSelected]}>
            <AppText
              style={[styles.itemText, selected && styles.itemTextSelected]}
            >
              {item.label}
            </AppText>
            {selected && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.primary}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const base = formStyles(theme);

  return StyleSheet.create({
    label: base.label,
    dropdown: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 12,
      minHeight: 52,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    },
    placeholder: {
      color: theme.dark700,
      fontSize: 15,
    },
    selectedText: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    listContainer: {
      backgroundColor: theme.backgroundDropdown,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: 6,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 8 },
      }),
    },
    itemContainer: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    itemRowSelected: {
      backgroundColor: theme.primaryBg,
    },
    itemText: {
      color: theme.textPrimary,
      fontSize: 15,
      flex: 1,
    },
    itemTextSelected: {
      color: theme.primaryText,
      fontWeight: '600',
    },
    searchInput: {
      backgroundColor: theme.backgroundInput,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.textPrimary,
      fontSize: 15,
      marginHorizontal: 12,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      height: 44,
    },
  });
};
