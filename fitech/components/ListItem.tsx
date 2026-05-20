import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { MenuItem } from '@/constants/screens';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = MenuItem & {
  hasChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  onClick?: null | (() => void);
};

export function ListItem({
  icon,
  label,
  route,
  hasChevron = true,
  style = {},
  onClick = null,
  destructive = false,
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
  }, [route, onClick, router]);

  return (
    <TouchableOpacity style={[styles.listItem, style]} onPress={handleClick}>
      {!!icon && (
        <View style={styles.iconWrapper}>
          <Ionicons
            name={icon as any}
            size={20}
            color={destructive ? theme.status.error.text : theme.icon.muted}
          />
        </View>
      )}

      <AppText
        variant="body"
        style={[
          styles.label,
          {
            color: destructive ? theme.status.error.text : theme.text.secondary,
          },
        ]}
      >
        {label}
      </AppText>

      {hasChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.text.secondary}
        />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.default,
      columnGap: 12,
    },
    iconWrapper: {
      width: 40,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      color: theme.text.secondary,
    },
  });
};
