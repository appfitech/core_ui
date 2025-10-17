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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Alert, View } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAutoRefreshToken } from '@/hooks/use-auto-refresh-token';
import { registerForPushNotificationsAsync } from '@/utils/register-for-push-notification';

import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { NavBar } from './components/NavBar';

SplashScreen.preventAutoHideAsync();

const HIDE_NAV_ROUTES = ['login', 'support', 'register'];
const PUSH_TOKEN_KEY = '@push_token_v1';

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

  useAutoRefreshToken();

  const segments = useSegments();
  const currentRoute = segments[0];

  useEffect(() => {
    let isMounted = true;

    // Foreground behavior (optional)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (!isMounted || !token) return;

      // Persist locally for testing
      try {
        const prev = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        if (prev !== token) {
          await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
        }
        if (__DEV__) {
          // Handy while testing in dev
          const saved = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
          console.log('Saved Expo push token:', saved);
        }
      } catch (err) {
        console.warn('Failed to persist push token', err);
      }

      // For quick manual copy while testing
      Alert.alert('Expo Push Token', token);

      // Placeholder: send token to your API when ready
      // await fetch('https://your.api/push-tokens', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token }),
      // });
    })();

    const subReceived = Notifications.addNotificationReceivedListener(() => {});
    const subResponse = Notifications.addNotificationResponseReceivedListener(
      () => {},
    );

    return () => {
      isMounted = false;
      subReceived.remove();
      subResponse.remove();
    };
  }, []);

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
