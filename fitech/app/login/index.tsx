import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AnimatedAppText } from '@/components/AnimatedAppText';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useLogin } from '@/lib/api/mutations/useLogin';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

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

  const { mutate: submitLogin, isPending } = useLogin();

  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!errorMsg) return;

    const t = setTimeout(() => setErrorMsg(null), 10000);

    return () => clearTimeout(t);
  }, [errorMsg]);

  const handleLogin = useCallback(() => {
    setErrorMsg(null);
    submitLogin(
      { username, password },
      {
        onSuccess: async (response) => {
          await setUser(response);
          router.replace(ROUTES.home);
        },
        onError: (error) => {
          setErrorMsg(extractErrorMessage(error));
        },
      },
    );
  }, [username, password, router, setUser, submitLogin]);

  const handleSignUp = () => {
    router.replace(ROUTES.register);
  };

  const handleToggleDisplayPass = () => {
    setDisplayPass((prev) => !prev);
  };

  return (
    <PageContainer
      hasBackButton={false}
      hasBottomPadding={false}
      style={styles.page}
    >
      <View style={styles.headerWrapper}>
        <Animated.Image
          entering={FadeInUp.duration(600)}
          source={require('@/assets/images/logos/rounded_logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AnimatedAppText
          entering={FadeInUp.delay(200)}
          variant="header"
          style={styles.headerTitle}
        >
          {loginScreen.header}
        </AnimatedAppText>
        <AnimatedAppText
          entering={FadeInUp.delay(300)}
          variant="subheader"
          style={styles.headerSubtitle}
        >
          {loginScreen.subheader}
        </AnimatedAppText>
      </View>

      {showUI && (
        <Card style={styles.card}>
          <ErrorBanner
            errorMessage={errorMsg}
            onClear={() => setErrorMsg(null)}
          />

          <TextInput
            startElement={
              <Ionicons name="at" size={20} color={styles.iconColor} />
            }
            placeholder="Usuario"
            keyboardType="email-address"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            startElement={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={styles.iconColor}
              />
            }
            endElement={
              <TouchableOpacity onPress={handleToggleDisplayPass}>
                <Ionicons
                  name={!displayPass ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={styles.iconColor}
                />
              </TouchableOpacity>
            }
            placeholder="Contraseña"
            secureTextEntry={!displayPass}
            value={password}
            style={styles.passwordInput}
            onChangeText={setPassword}
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity>
              <AppText style={styles.forgotText}>
                {'¿Olvidaste tu contraseña?'}
              </AppText>
            </TouchableOpacity>
          </View>

          <Button
            label={'Iniciar sesión'}
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={!username || !password}
            loading={isPending}
          />

          <View style={styles.footerText}>
            <AppText style={styles.footerPrompt}>
              {'¿No tienes una cuenta?'}
            </AppText>
            <TouchableOpacity onPress={handleSignUp}>
              <AppText style={styles.signUp}>{'Regístrate'}</AppText>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const iconColor = theme.dark800;

  return {
    ...StyleSheet.create({
      page: {
        paddingHorizontal: 24,
      },
      card: {
        marginTop: 20,
        rowGap: 12,
      },
      headerWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 36,
      },
      logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
      },
      headerTitle: {
        marginTop: 30,
      },
      headerSubtitle: {
        marginTop: 8,
      },
      passwordInput: {
        marginBottom: 0,
      },
      optionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
      },
      forgotText: {
        fontSize: 15,
        textDecorationLine: 'underline',
      },
      loginButton: {
        marginTop: 24,
      },
      footerText: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      footerPrompt: {
        color: theme.textSecondary,
        fontSize: 15,
        fontWeight: '500',
      },
      signUp: {
        color: theme.green700,
        fontWeight: '600',
        marginLeft: 10,
        fontSize: 15,
      },
    }),
    iconColor,
  };
};
