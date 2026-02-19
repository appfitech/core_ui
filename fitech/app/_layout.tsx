import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_200ExtraLight_Italic,
  PlusJakartaSans_300Light,
  PlusJakartaSans_300Light_Italic,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_700Bold_Italic,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_800ExtraBold_Italic,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { AlertProvider } from '@/contexts/AlertContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAutoRefreshToken } from '@/hooks/use-auto-refresh-token';
import { useUserStore } from '@/stores/user';

import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { NavBar } from './components/NavBar';
import { toastConfig } from './components/Toast';
import { withPushNotifications } from './hoc/withPushNotifications';

SplashScreen.preventAutoHideAsync();

const HIDE_NAV_ROUTES = ['login', 'support', 'register', 'chats'];

const PUBLIC_ROUTES = ['login', 'register', 'support', 'index'];

function RoutedApp() {
  useAutoRefreshToken();

  const router = useRouter();
  const segments = useSegments();
  const token = useUserStore((s) => s.token);
  const currentRoute = segments[0];

  useEffect(() => {
    if (
      token === null &&
      currentRoute &&
      !PUBLIC_ROUTES.includes(currentRoute)
    ) {
      router.replace('/');
    }
  }, [token, currentRoute, router]);

  const shouldHideNav =
    HIDE_NAV_ROUTES.includes(currentRoute) || currentRoute === undefined;

  return (
    <View style={styles.flex1}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} />
      {!shouldHideNav && <NavBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

const RoutedAppWithPush = withPushNotifications(RoutedApp);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_200ExtraLight_Italic,
    PlusJakartaSans_300Light,
    PlusJakartaSans_300Light_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_700Bold_Italic,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <ThemeProvider>
        <AlertProvider>
          <ReactQueryProvider>
            <RoutedAppWithPush />
          </ReactQueryProvider>
        </AlertProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
