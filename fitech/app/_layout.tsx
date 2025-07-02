import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/urbanist';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { NavBar } from './components/NavBar';
SplashScreen.preventAutoHideAsync();

const HIDE_NAV_ROUTES = ['login', 'onboarding', 'support', 'register'];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
  });

  const segments = useSegments();
  const currentRoute = segments[0];

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const shouldHideNav =
    HIDE_NAV_ROUTES.includes(currentRoute) || currentRoute === undefined;

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />

          {!shouldHideNav && <NavBar />}
        </View>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
