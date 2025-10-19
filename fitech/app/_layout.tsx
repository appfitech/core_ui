import {
  Urbanist_100Thin,
  Urbanist_100Thin_Italic,
  Urbanist_200ExtraLight,
  Urbanist_200ExtraLight_Italic,
  Urbanist_300Light,
  Urbanist_300Light_Italic,
  Urbanist_400Regular,
  Urbanist_400Regular_Italic,
  Urbanist_500Medium,
  Urbanist_500Medium_Italic,
  Urbanist_600SemiBold,
  Urbanist_600SemiBold_Italic,
  Urbanist_700Bold,
  Urbanist_700Bold_Italic,
  Urbanist_800ExtraBold,
  Urbanist_800ExtraBold_Italic,
  Urbanist_900Black,
  Urbanist_900Black_Italic,
  useFonts,
} from '@expo-google-fonts/urbanist';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAutoRefreshToken } from '@/hooks/use-auto-refresh-token';

import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { NavBar } from './components/NavBar';
import { toastConfig } from './components/Toast';
import { withPushNotifications } from './hoc/withPushNotifications';
SplashScreen.preventAutoHideAsync();

const HIDE_NAV_ROUTES = ['login', 'support', 'register'];

function RoutedApp() {
  useAutoRefreshToken();

  const segments = useSegments();
  const currentRoute = segments[0];

  const shouldHideNav =
    HIDE_NAV_ROUTES.includes(currentRoute) || currentRoute === undefined;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} />
      {!shouldHideNav && <NavBar />}
    </View>
  );
}

const RoutedAppWithPush = withPushNotifications(RoutedApp);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Urbanist_100Thin,
    Urbanist_200ExtraLight,
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
    Urbanist_100Thin_Italic,
    Urbanist_200ExtraLight_Italic,
    Urbanist_300Light_Italic,
    Urbanist_400Regular_Italic,
    Urbanist_500Medium_Italic,
    Urbanist_600SemiBold_Italic,
    Urbanist_700Bold_Italic,
    Urbanist_800ExtraBold_Italic,
    Urbanist_900Black_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ReactQueryProvider>
          <RoutedAppWithPush />
        </ReactQueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
