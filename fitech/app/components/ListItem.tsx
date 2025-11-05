import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { AllowedPath } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  icon?: string;
  label: string;
  route?: AllowedPath;
  hasChevron?: boolean;
  description?: string;
  style?: StyleProp<ViewStyle>;
  onClick?: null | (() => void);
};

export function ListItem({
  icon,
  label,
  description,
  route,
  hasChevron = true,
  style = {},
  onClick = null,
}: Props) {
  const router = useRouter();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }

    if (!route) {
      return;
    }

    router.push(route);
  }, [route]);

  return (
    <TouchableOpacity style={[styles.listItem, style]} onPress={handleClick}>
      {!!icon && (
        <View style={styles.iconWrapper}>
          <Feather name={icon as any} size={23} color={theme.green800} />
        </View>
      )}
      <View style={[{ flex: 1 }, description && { paddingHorizontal: 16 }]}>
        <AppText style={[styles.label, description && { paddingVertical: 0 }]}>
          {label}
        </AppText>
        {description && (
          <AppText style={{ color: theme.dark500 }}>{description}</AppText>
        )}
      </View>
      {hasChevron && (
        <Feather name="chevron-right" size={20} color={theme.green700} />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.dark300,
      columnGap: 12,
    },
    iconWrapper: {
      width: 40,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: theme.dark900,
      paddingVertical: 10,
    },
  });
