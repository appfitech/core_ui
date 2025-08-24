import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInUp,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';

import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-reditect';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

import { TRANSLATIONS } from '../../constants/strings';
import { useLogin } from '../api/mutations/useLogin';
import { AnimatedAppText } from '../components/AnimatedAppText';
import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

function extractErrorMessage(err: unknown): string {
  const anyErr: any = err;
  if (typeof anyErr === 'string') return anyErr;
  if (anyErr?.response?.data?.message)
    return String(anyErr.response.data.message);
  if (anyErr?.response?.data?.error) return String(anyErr.response.data.error);
  if (anyErr?.data?.message) return String(anyErr.data.message);
  if (anyErr?.message) return String(anyErr.message);
  return 'Ocurrió un error al iniciar sesión. Inténtalo nuevamente.';
}

export default function LoginScreen() {
  const { theme } = useTheme();
  useAuthRedirect();

  const { loginScreen } = TRANSLATIONS;
  const styles = getStyles(theme);

  const [showUI, setShowUI] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayPass, setDisplayPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const { mutate: submitLogin } = useLogin();

  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(null), 10000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  const handleChange = useCallback(
    (key: string) => (text: string) => {
      if (key === 'username') {
        setUsername(text);
        return;
      }
      setPassword(text);
    },
    [],
  );

  const handleLogin = useCallback(() => {
    setErrorMsg(null);
    submitLogin(
      { username, password },
      {
        onSuccess: (response) => {
          setUser(response);
          router.replace(ROUTES.home);
        },
        onError: (error) => {
          console.log('[Login] error', error);
          setErrorMsg(extractErrorMessage(error));
        },
      },
    );
  }, [username, password]);

  const handleSignUp = () => {
    router.replace(ROUTES.register);
  };

  const handleToggleDisplayPass = () => {
    setDisplayPass((prev) => !prev);
  };

  return (
    <PageContainer style={{ paddingHorizontal: 24 }}>
      <View style={styles.header}>
        <Animated.Image
          entering={FadeInUp.duration(600)}
          source={require('../../assets/images/logos/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AnimatedAppText
          entering={FadeInUp.delay(200)}
          style={styles.headerTitle}
        >
          {loginScreen.header}
        </AnimatedAppText>
        <AnimatedAppText
          entering={FadeInUp.delay(300)}
          style={styles.headerSubtitle}
        >
          {loginScreen.subheader}
        </AnimatedAppText>
      </View>

      {showUI && (
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          style={styles.card}
        >
          {/* Error banner */}
          {errorMsg && (
            <Animated.View entering={FadeInUp} style={styles.errorBanner}>
              <Feather
                name="alert-triangle"
                size={18}
                color={styles.errorText.color as string}
              />
              <AppText style={styles.errorText} numberOfLines={3}>
                {errorMsg}
              </AppText>
              <TouchableOpacity
                onPress={() => setErrorMsg(null)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Feather
                  name="x"
                  size={18}
                  color={styles.errorText.color as string}
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.inputWrapper}>
            <Feather
              name="at-sign"
              size={20}
              color={theme.dark800}
              style={styles.iconLeft}
            />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor={theme.dark800}
              keyboardType="email-address"
              style={[styles.input, { flex: 1 }]}
              value={username}
              onChangeText={handleChange('username')}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather
              name="lock"
              size={20}
              color={theme.dark800}
              style={styles.iconLeft}
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={theme.dark800}
              secureTextEntry={!displayPass}
              value={password}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              onChangeText={handleChange('password')}
            />
            <TouchableOpacity onPress={handleToggleDisplayPass}>
              <Feather
                name={!displayPass ? 'eye' : 'eye-off'}
                size={20}
                color={theme.dark800}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity>
              <AppText style={styles.forgotText}>
                {'¿Olvidaste tu contraseña?'}
              </AppText>
            </TouchableOpacity>
          </View>

          <Animated.View entering={ZoomIn.delay(200)}>
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <AppText style={styles.submitText}>{'Iniciar sesión'}</AppText>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.footerText}>
            <AppText
              style={{ color: theme.dark400, fontSize: 18, fontWeight: '500' }}
            >
              {'¿No tienes una cuenta?'}
            </AppText>
            <TouchableOpacity onPress={handleSignUp}>
              <AppText style={styles.signUp}>{'Regístrate'}</AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    header: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 10,
    },
    headerTitle: {
      ...HEADING_STYLES(theme).header,
      fontWeight: '600',
      marginTop: 40,
    },
    headerSubtitle: {
      ...HEADING_STYLES(theme).subheader,
      marginTop: 8,
    },
    card: {
      backgroundColor: theme.backgroundInverted,
      width: '100%',
      borderRadius: 16,
      padding: 24,
      shadowColor: theme.background,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
      marginTop: 20,
    },
    // Error banner styles
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: theme.errorBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.errorBorder,
    },
    errorText: {
      flex: 1,
      color: theme.errorText,
      fontSize: 14,
      fontWeight: '600',
    },

    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    forgotText: {
      fontSize: 16,
      color: theme.dark100,
      fontWeight: '500',
    },
    footerText: {
      marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    signUp: {
      color: theme.dark100,
      fontWeight: '600',
      marginLeft: 10,
      fontSize: 18,
    },
    gradient: {
      flex: 1,
    },
    iconLeft: {
      marginRight: 8,
    },
    ...SHARED_STYLES(theme),
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundInput,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
  });
