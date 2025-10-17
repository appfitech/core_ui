import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AllowedPath } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  icon?: string;
  label: string;
  route: AllowedPath;
};

export function ListItem({ icon, label, route }: Props) {
  const router = useRouter();
  const { theme } = useTheme();

  const styles = getStyles(theme);

  const handleClick = useCallback(() => {
    router.push(route);
  }, [route]);

  return (
    <TouchableOpacity style={styles.listItem} onPress={handleClick}>
      <View style={styles.iconWrapper}>
        <Feather name={icon as any} size={23} color={theme.green800} />
      </View>
      <AppText style={styles.label}>{label}</AppText>
      <Feather name="chevron-right" size={20} color={theme.green700} />
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
    },
    iconWrapper: {
      width: 40,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '500',
      color: theme.dark900,
      paddingVertical: 10,
    },
  });
