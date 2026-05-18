import { Ionicons } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { formStyles } from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';
import { Option } from '@/types/forms';
import { FullTheme } from '@/types/theme';

export type Props = {
  isOpen: boolean;
  options: Option[];
  value: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onChange: (value: any) => void;
  placeholder?: string;
  zIndex?: number;
};

export function Dropdown({
  isOpen,
  options,
  onChange,
  setIsOpen,
  value,
  zIndex,
  placeholder = 'Seleccione',
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const elevation = Platform.OS === 'android' ? 20 : 0;

  return (
    <View
      style={{
        position: 'relative',
        zIndex,
        ...(Platform.OS === 'android' ? { elevation } : null),
      }}
    >
      <DropDownPicker
        open={isOpen}
        value={value}
        items={options}
        setOpen={setIsOpen}
        setValue={(getValue) => onChange(getValue())}
        listMode="SCROLLVIEW"
        style={styles.dropdown}
        placeholder={placeholder}
        placeholderStyle={{
          color: theme.dark700,
          fontSize: 15,
        }}
        zIndex={zIndex}
        textStyle={{
          color: theme.textPrimary,
          fontSize: 15,
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.backgroundDropdown,
          borderColor: theme.border,
          zIndex: zIndex,
          elevation,
        }}
        listItemContainerStyle={{
          backgroundColor: theme.backgroundDropdown,
        }}
        listItemLabelStyle={{
          color: theme.textPrimary,
          fontSize: 15,
        }}
        selectedItemContainerStyle={{
          backgroundColor: theme.primaryBg,
        }}
        selectedItemLabelStyle={{
          color: theme.primaryText,
          fontWeight: '700',
        }}
        ArrowDownIconComponent={({ style }) => (
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.icon}
            style={style}
          />
        )}
        ArrowUpIconComponent={({ style }) => (
          <Ionicons
            name="chevron-up"
            size={20}
            color={theme.icon}
            style={style}
          />
        )}
        TickIconComponent={({ style }) => (
          <Ionicons
            name="checkmark"
            size={20}
            color={theme.icon}
            style={style}
          />
        )}
      />
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...formStyles(theme),
  });
