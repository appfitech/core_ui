import { Ionicons } from '@expo/vector-icons';
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/urbanist';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { ReactQueryProvider } from './providers/ReactQueryProvider';
SplashScreen.preventAutoHideAsync();

const NAV_ITEMS_MAPPER = {
  home: { icon: 'home' },
  workouts: { icon: 'barbell' },
  trainers: { icon: 'people' },
  profile: { icon: 'person' },
};

const HIDE_NAV_ROUTES = ['login', 'onboarding', 'support', 'register'];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
  });

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0];

  const handleNavItemClick = useCallback(
    (route) => () => {
      router.push(`/${route}`);
    },
    [router],
  );

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  console.log('[K] currentRoute', currentRoute);

  const shouldHideNav =
    HIDE_NAV_ROUTES.includes(currentRoute) || currentRoute === undefined;

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />

          {!shouldHideNav && (
            <View
              style={[
                styles.navBar,
                { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
              ]}
            >
              {Object.keys(NAV_ITEMS_MAPPER).map((navKey) => (
                <TouchableOpacity
                  key={navKey}
                  style={styles.navItem}
                  onPress={handleNavItemClick(navKey)}
                >
                  <Ionicons
                    name={NAV_ITEMS_MAPPER[navKey].icon}
                    size={28}
                    color={currentRoute === navKey ? '#fff' : '#AAA'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F4C81',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
