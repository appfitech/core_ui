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
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { AlertProvider } from '@/contexts/AlertContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAutoRefreshToken } from '@/hooks/use-auto-refresh-token';
import { useUserStore } from '@/stores/user';
import { getHrefFromPushData } from '@/utils/navigate-from-push-notification';

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

  const pendingPushHref = useRef<string | null>(null);
  /** Only read getLastNotificationResponseAsync once per app session (avoid stale repeats on effect re-run). */
  const coldStartPushChecked = useRef(false);

  const navigateFromPush = useCallback(
    (data: unknown) => {
      const href = getHrefFromPushData(data);
      if (!href) return;
      if (!token) {
        pendingPushHref.current = href as string;
        return;
      }
      pendingPushHref.current = null;
      InteractionManager.runAfterInteractions(() => {
        try {
          router.push(href);
        } catch (e) {
          console.warn('[Push] router.push failed', e);
        }
      });
    },
    [router, token],
  );

  useEffect(() => {
    if (token && pendingPushHref.current) {
      const href = pendingPushHref.current;
      pendingPushHref.current = null;
      InteractionManager.runAfterInteractions(() => {
        try {
          router.push(href as Parameters<typeof router.push>[0]);
        } catch (e) {
          console.warn('[Push] deferred router.push failed', e);
        }
      });
    }
  }, [token, router]);

  useEffect(() => {
    const onResponse = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      navigateFromPush(data);
    };

    const sub =
      Notifications.addNotificationResponseReceivedListener(onResponse);

    (async () => {
      if (coldStartPushChecked.current) return;
      coldStartPushChecked.current = true;
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) onResponse(last);
    })();

    return () => sub.remove();
  }, [navigateFromPush]);

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
      {!shouldHideNav && <NavBar />}
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFillObject, styles.toastLayer]}
      >
        <Toast config={toastConfig} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  toastLayer: {
    zIndex: 1000,
    elevation: Platform.OS === 'android' ? 1000 : 0,
  },
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
