import { Ionicons } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';

import { FullTheme } from '../types/theme';

type Props = {
  isOpen: boolean;
  options: { label: string; value: any }[];
  value: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onChange: (callback: any) => void;
};

export function Dropdown({
  isOpen,
  options,
  onChange,
  setIsOpen,
  value,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <DropDownPicker
      open={isOpen}
      value={value}
      items={options}
      setOpen={setIsOpen}
      setValue={(callback) => onChange(callback)}
      listMode="SCROLLVIEW"
      style={styles.dropdown}
      placeholderStyle={{
        color: theme.dark700,
      }}
      textStyle={{
        color: theme.textPrimary,
        fontSize: 17,
      }}
      dropDownContainerStyle={{
        backgroundColor: theme.backgroundDropdown,
        borderColor: 'transparent',
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
        <Ionicons name="checkmark" size={20} color={theme.icon} style={style} />
      )}
    />
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...SHARED_STYLES(theme),
  });
