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

import { AllowedPath } from '@/constants/routes';
import { textStyles } from '@/constants/styles';
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
  const iconColor = theme.primary;

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
          <Ionicons name={icon as any} size={23} color={iconColor} />
        </View>
      )}
      <View style={[{ flex: 1 }, description && { paddingHorizontal: 16 }]}>
        <AppText style={[styles.label, description && { paddingVertical: 0 }]}>
          {label}
        </AppText>
        {description && (
          <AppText style={{ color: theme.textSecondary }}>
            {description}
          </AppText>
        )}
      </View>
      {hasChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      columnGap: 12,
    },
    iconWrapper: {
      width: 40,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      ...text.body,
      color: theme.textPrimary,
    },
  });
};
