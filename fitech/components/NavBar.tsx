import { Ionicons } from '@expo/vector-icons';
import { type Href, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { useSetTabBarInset } from '@/contexts/TabBarInsetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';

import { AppText } from './AppText';

SplashScreen.preventAutoHideAsync();

const FAB_LOGO = require('@/assets/images/logos/rounded_logo.webp');
const FAB_SIZE = 64;

const NAV_ITEMS_MAPPER = (isTrainer: boolean = false) => ({
  home: { icon: 'home-outline', route: ROUTES.home, label: 'Home' },
  workouts: {
    icon: 'barbell-outline',
    route: ROUTES.workouts,
    label: 'Actividad',
  },
  trainers: {
    icon: 'people-outline',
    route: isTrainer ? ROUTES.trainerClients : ROUTES.trainers,
    label: isTrainer ? 'Clientes' : 'Trainers',
  },
  profile: { icon: 'person-outline', route: ROUTES.profile, label: 'Perfil' },
});

export function NavBar() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const user = useUserStore((s) => s.user);

  const currentPath =
    '/' + (Array.isArray(segments) ? segments.filter(Boolean).join('/') : '');
  const isPremium = Boolean(user?.user?.premium);
  const isTrainer = useUserStore((s) => s.getIsTrainer());
  const setTabBarInset = useSetTabBarInset();
  const fabBottom = (insets.bottom || 10) + 32;
  const navBarPaddingBottom = insets.bottom > 0 ? insets.bottom : 10;

  const reportTabBarInset = useCallback(
    (navBarHeight: number) => {
      const fabTopFromBottom = fabBottom + FAB_SIZE;
      const androidNavEstimate =
        Platform.OS === 'android' && insets.bottom < 20 ? 24 : 0;
      setTabBarInset(
        Math.max(navBarHeight, fabTopFromBottom) + 12 + androidNavEstimate,
      );
    },
    [fabBottom, insets.bottom, setTabBarInset],
  );

  useEffect(() => {
    return () => {
      setTabBarInset(0);
    };
  }, [setTabBarInset]);

  const handleNavItemClick = useCallback(
    (route: Href) => () => {
      router.push(route);
    },
    [router],
  );

  const handlePremiumClick = () => {
    router.push(ROUTES.premiumFeatures);
  };

  return (
    <>
      <View
        style={[styles.navBar, { paddingBottom: navBarPaddingBottom }]}
        onLayout={(e) => reportTabBarInset(e.nativeEvent.layout.height)}
      >
        {Object.entries(NAV_ITEMS_MAPPER(isTrainer)).map(
          ([key, { icon, route, label }]) => {
            const isCurrentRoute =
              currentPath === route || currentPath.startsWith(route + '/');

            return (
              <TouchableOpacity
                key={key}
                style={styles.navItem}
                onPress={handleNavItemClick(route)}
              >
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={26}
                  color={
                    isCurrentRoute ? theme.brand.primary : theme.icon.muted
                  }
                />
                <AppText
                  variant="nav"
                  style={
                    isCurrentRoute
                      ? styles.navLabelActive
                      : styles.navLabelInactive
                  }
                >
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          },
        )}
      </View>

      <Pressable
        onPress={isPremium ? handlePremiumClick : undefined}
        disabled={!isPremium}
        style={[
          styles.fab,
          { bottom: fabBottom },
          !isPremium && styles.fabDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isPremium }}
        accessibilityLabel="FITECH Premium"
      >
        <Image
          source={FAB_LOGO}
          style={[styles.fabLogo, !isPremium && styles.fabLogoDisabled]}
          resizeMode="contain"
        />
      </Pressable>
    </>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    navBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background.app,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border.subtle,
      zIndex: 1,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 4,
    },
    navLabelActive: {
      color: theme.brand.primary,
    },
    navLabelInactive: {
      color: theme.icon.muted,
    },
    fab: {
      position: 'absolute',
      alignSelf: 'center',
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      backgroundColor: theme.button.primaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    fabDisabled: {
      backgroundColor: theme.background.cardHover,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    fabLogo: {
      width: 40,
      height: 40,
    },
    fabLogoDisabled: {
      opacity: 0.35,
    },
  });
