import { Ionicons } from '@expo/vector-icons';
import { ReactElement, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import { Dropdown as DropdownElement } from 'react-native-element-dropdown';

import { formStyles, textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Tag } from './Tag';

type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
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
  required?: boolean;
  renderItem?: (item: DropdownItem, selected?: boolean) => ReactElement | null;
  onSearchChange?: (text: string) => void;
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
  required = true,
  renderItem: renderItemProp,
  onSearchChange,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const data = useMemo<DropdownItem[]>(
    () =>
      options.map((option) => ({
        label: option.label,
        value: String(option.value),
        disabled: option.disabled,
      })),
    [options],
  );

  const hasDisabledItems = useMemo(
    () => data.some((item) => item.disabled),
    [data],
  );

  const selectedValue =
    value === null || value === undefined || value === ''
      ? null
      : String(value);

  const enableSearch = search ?? data.length > 6;
  const dropdownMode = enableSearch ? 'modal' : 'default';

  return (
    <View key={id || 'dropdown'} style={{ zIndex }}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText style={styles.label}>{label}</AppText>
          {!required && (
            <Tag
              backgroundColor={theme.status.warning.bg}
              textColor={theme.status.warning.text}
              style={styles.optionalTag}
              label="Opcional"
            />
          )}
        </View>
      )}
      <DropdownElement
        disable={disabled}
        data={data}
        labelField="label"
        valueField="value"
        value={selectedValue}
        mode={dropdownMode}
        keyboardAvoiding
        backgroundColor={
          dropdownMode === 'modal' ? 'rgba(0, 0, 0, 0.55)' : undefined
        }
        maxHeight={dropdownMode === 'modal' ? 420 : 280}
        search={enableSearch}
        searchPlaceholder={searchPlaceholder}
        confirmSelectItem={hasDisabledItems}
        onConfirmSelectItem={
          hasDisabledItems
            ? (item: DropdownItem) => {
                if (item.disabled) return;
                onChange(item.value);
              }
            : undefined
        }
        onChange={
          hasDisabledItems
            ? () => undefined
            : (item: DropdownItem) => {
                onChange(item.value);
              }
        }
        onChangeText={onSearchChange}
        onBlur={() => onSearchChange?.('')}
        placeholder={placeholder}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        selectedTextProps={{ numberOfLines: 1 }}
        containerStyle={styles.listContainer}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        activeColor={theme.brand.primarySoft}
        searchPlaceholderTextColor={theme.icon.muted}
        iconColor={theme.icon.secondary}
        renderInputSearch={
          enableSearch
            ? (onSearch) => (
                <View style={styles.searchWrap}>
                  <NativeTextInput
                    style={styles.searchInput}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={theme.icon.muted}
                    selectionColor={theme.brand.primary}
                    autoCorrect={false}
                    onChangeText={onSearch}
                  />
                </View>
              )
            : undefined
        }
        renderRightIcon={() => (
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.icon.secondary}
          />
        )}
        renderItem={
          renderItemProp ??
          ((item: DropdownItem, selected?: boolean) => (
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
                  color={theme.brand.primary}
                />
              )}
            </View>
          ))
        }
      />
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const base = formStyles(theme);
  const text = textStyles(theme);

  return StyleSheet.create({
    label: base.label,
    labelContainer: base.labelContainer,
    optionalTag: base.optionalTag,
    dropdown: {
      backgroundColor: theme.background.input,
      borderRadius: 12,
      minHeight: 52,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    },
    placeholder: {
      ...text.link,
      color: theme.icon.muted,
    },
    selectedText: {
      ...text.link,
      color: theme.text.primary,
    },
    listContainer: {
      backgroundColor: theme.background.cardHover,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      marginTop: 6,
      maxHeight: 280,
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
      borderBottomColor: theme.border.default,
    },
    itemRowSelected: {
      backgroundColor: theme.brand.primarySoft,
    },
    itemText: {
      ...text.link,
      color: theme.text.primary,
      flex: 1,
    },
    itemTextSelected: {
      ...text.linkSemibold,
      color: theme.brand.primaryLight,
    },
    searchWrap: {
      marginHorizontal: 12,
      marginTop: 12,
      marginBottom: 8,
    },
    searchInput: {
      ...text.link,
      backgroundColor: theme.background.input,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border.default,
      color: theme.text.primary,
      paddingHorizontal: 12,
      height: 44,
    },
  });
};
