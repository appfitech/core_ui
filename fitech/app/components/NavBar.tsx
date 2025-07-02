import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';
import { transparentize } from '@/utils/style';

SplashScreen.preventAutoHideAsync();

const NAV_ITEMS_MAPPER = {
  home: { icon: 'home', route: ROUTES.home, label: 'Home' },
  workouts: { icon: 'barbell', route: ROUTES.workouts, label: 'Actividad' },
  trainers: { icon: 'people', route: ROUTES.trainers, label: 'Trainers' },
  profile: { icon: 'person', route: ROUTES.profile, label: 'Perfil' },
};

export function NavBar() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const currentRoute = segments[0];

  const handleNavItemClick = useCallback(
    (route) => () => {
      router.push(route);
    },
    [router],
  );

  return (
    <View
      style={[
        styles.navBar,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      {Object.keys(NAV_ITEMS_MAPPER).map((navKey) => {
        const { icon, route, label } = NAV_ITEMS_MAPPER[navKey];
        const isCurrentRoute = currentRoute === navKey;

        return (
          <TouchableOpacity
            key={navKey}
            style={styles.navItem}
            onPress={handleNavItemClick(route)}
          >
            <Ionicons
              name={icon}
              size={28}
              color={isCurrentRoute ? theme.primary : theme.green900}
            />
            <Text
              style={{
                color: isCurrentRoute ? theme.primary : theme.green900,
                fontSize: 13,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    navBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: 3,
      borderTopColor: transparentize(theme.border, 0.8),
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
