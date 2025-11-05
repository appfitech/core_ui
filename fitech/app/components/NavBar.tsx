import { Feather } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { transparentize } from '@/utils/style';

import { AppText } from './AppText';

SplashScreen.preventAutoHideAsync();

const NAV_ITEMS_MAPPER = (isTrainer: boolean = false) => ({
  home: { icon: 'home', route: ROUTES.home, label: 'Home' },
  workouts: { icon: 'activity', route: ROUTES.workouts, label: 'Actividad' },
  trainers: {
    icon: 'users',
    route: isTrainer ? ROUTES.trainerClients : ROUTES.trainers,
    label: isTrainer ? 'Clientes' : 'Trainers',
  },
  profile: { icon: 'user', route: ROUTES.profile, label: 'Perfil' },
});

export function NavBar() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const user = useUserStore((s) => s.user);

  const currentRoute = segments[0];
  const isPremium = user?.user?.premium;
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const handleNavItemClick = useCallback(
    (route) => () => {
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
        style={[
          styles.navBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ]}
      >
        {Object.entries(NAV_ITEMS_MAPPER(isTrainer)).map(
          ([key, { icon, route, label }]) => {
            const isCurrentRoute = currentRoute === key;

            return (
              <TouchableOpacity
                key={key}
                style={styles.navItem}
                onPress={handleNavItemClick(route)}
              >
                <Feather
                  name={icon}
                  size={28}
                  color={isCurrentRoute ? theme.primary : theme.green900}
                />
                <AppText
                  style={{
                    color: isCurrentRoute ? theme.primary : theme.green900,
                    fontSize: 13,
                  }}
                >
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          },
        )}
      </View>

      {isPremium && (
        <TouchableOpacity
          onPress={handlePremiumClick}
          style={[
            styles.fab,
            {
              bottom: (insets.bottom || 10) + 32,
            },
          ]}
        >
          <Image
            source={
              theme.isDark
                ? require('../../assets/images/logos/rounded_logo.webp')
                : require('../../assets/images/logos/rounded_logo.webp')
            }
            style={{ width: 40, height: '100%' }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
    </>
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
      zIndex: 1,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fab: {
      position: 'absolute',
      alignSelf: 'center',
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: theme.background,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      zIndex: 10,
    },
  });
