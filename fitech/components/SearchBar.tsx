import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const INPUT_HEIGHT = 44;

type Props = {
  shouldHideEndIcon?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

export function SearchBar({
  onPress,
  onChangeText,
  readOnly,
  placeholder,
  containerStyle,
  value,
  style,
  ...rest
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.searchBar, containerStyle]}>
      <Ionicons name="search-outline" size={18} color={theme.text.secondary} />
      <TextInput
        placeholder={placeholder}
        readOnly={readOnly}
        placeholderTextColor={theme.text.secondary}
        style={[styles.input, style]}
        onPress={onPress}
        onChangeText={onChangeText}
        value={value}
        {...rest}
      />
    </View>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
      width: '100%',
      height: INPUT_HEIGHT,
      paddingHorizontal: 14,
      backgroundColor: theme.background.input,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    input: {
      ...text.link,
      flex: 1,
      height: INPUT_HEIGHT,
      paddingVertical: 0,
      color: theme.text.primary,
      ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
    },
  });
};
