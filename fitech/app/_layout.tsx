import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { NavBar } from '@/components/NavBar';
import { toastConfig } from '@/components/Toast';
import {
  shouldShowNavBar,
  STACK_SCREEN_OPTIONS,
} from '@/constants/navigation';
import { THEME } from '@/constants/theme';
import { AlertProvider } from '@/contexts/AlertContext';
import { DatePickerOverlayProvider } from '@/contexts/DatePickerOverlayContext';
import { TabBarInsetProvider } from '@/contexts/TabBarInsetContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { withPushNotifications } from '@/hoc/withPushNotifications';
import { useAutoRefreshToken } from '@/hooks/use-auto-refresh-token';
import { useUserStore } from '@/stores/user';
import { getHrefFromPushData } from '@/utils/navigate-from-push-notification';

import { ReactQueryProvider } from '../providers/ReactQueryProvider';

SplashScreen.preventAutoHideAsync();

const PUBLIC_ROUTES = [
  'login',
  'register',
  'support',
  'forgot-password',
  'reset-password',
  'verify-email',
  'index',
];

function RoutedApp() {
  useAutoRefreshToken();

  const router = useRouter();
  const segments = useSegments();
  const token = useUserStore((s) => s.token);
  const user = useUserStore((s) => s.user);
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);
  const currentRoute = segments[0];
  const isAuthenticated = Boolean(token ?? user);

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
    if (!isSessionHydrated) return;

    if (
      !isAuthenticated &&
      currentRoute &&
      !PUBLIC_ROUTES.includes(currentRoute)
    ) {
      router.replace('/');
    }
  }, [isSessionHydrated, isAuthenticated, currentRoute, router]);

  const shouldHideNav = !shouldShowNavBar(segments);

  return (
    <View style={styles.flex1}>
      <Stack screenOptions={STACK_SCREEN_OPTIONS} />
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
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={THEME.background.app} />
        <ThemeProvider>
          <TabBarInsetProvider>
            <ReactQueryProvider>
              <AlertProvider>
                <DatePickerOverlayProvider>
                  <RoutedAppWithPush />
                </DatePickerOverlayProvider>
              </AlertProvider>
            </ReactQueryProvider>
          </TabBarInsetProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
