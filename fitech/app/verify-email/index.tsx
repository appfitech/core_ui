import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import { AnimatedAppText } from '@/components/AnimatedAppText';
import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useVerifyEmail } from '@/lib/api/mutations/use-account-mutations';
import { AppTheme } from '@/types/theme';
import { resolveTokenFromParams } from '@/utils/deep-link';
import { resolveVerifyEmailError } from '@/utils/errors';

export default function VerifyEmailScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { verifyEmailScreen } = TRANSLATIONS;

  const params = useLocalSearchParams<{
    token?: string | string[];
    resetToken?: string | string[];
    reset_token?: string | string[];
  }>();
  const token = resolveTokenFromParams(params);

  const hasAttemptedRef = useRef(false);

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useVerifyEmail();

  useEffect(() => {
    if (!token || hasAttemptedRef.current) return;

    hasAttemptedRef.current = true;
    verifyEmail(token);
  }, [token, verifyEmail]);

  const handleGoToLogin = useCallback(() => {
    router.replace(ROUTES.login);
  }, [router]);

  const handleRetry = useCallback(() => {
    if (!token) return;
    reset();
    verifyEmail(token);
  }, [reset, token, verifyEmail]);

  const errorMessage = !token
    ? verifyEmailScreen.missingToken
    : isError
      ? resolveVerifyEmailError(error, {
          invalidToken: verifyEmailScreen.invalidToken,
          fallback: verifyEmailScreen.errorFallback,
        })
      : null;

  const showLoading = Boolean(token) && isPending && !isSuccess && !isError;
  const showSuccess = Boolean(token) && isSuccess;

  const description = showSuccess
    ? verifyEmailScreen.successMessage
    : showLoading
      ? verifyEmailScreen.verifying
      : !token
        ? verifyEmailScreen.missingToken
        : null;

  return (
    <ImageBackground
      source={require('@/assets/images/backgrounds/verify_email_bg.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} pointerEvents="none" />
      <PageContainer
        transparentBackground
        hasBackButton={false}
        hasBottomPadding={false}
        hasNoTopPadding
        contentPaddingBottom={32}
        style={styles.page}
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            {showSuccess ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color={styles.iconSuccess.color}
              />
            ) : showLoading ? (
              <ActivityIndicator size="large" color={theme.brand.primary} />
            ) : (
              <Ionicons
                name="mail-outline"
                size={36}
                color={styles.iconAccent.color}
              />
            )}
          </View>

          <View style={styles.textContainer}>
            <AnimatedAppText variant="sectionTitle" style={styles.title}>
              {showSuccess
                ? verifyEmailScreen.successTitle
                : verifyEmailScreen.title}
            </AnimatedAppText>

            {description ? (
              <AnimatedAppText variant="subheader" style={styles.description}>
                {description}
              </AnimatedAppText>
            ) : null}
          </View>

          <ErrorBanner errorMessage={errorMessage} />

          {(showSuccess || isError || !token) && (
            <Button
              label={verifyEmailScreen.goToLogin}
              onPress={handleGoToLogin}
              animated={false}
            />
          )}

          {isError && token ? (
            <Button
              type="secondary"
              label={verifyEmailScreen.retryButton}
              onPress={handleRetry}
              animated={false}
            />
          ) : null}
        </View>
      </PageContainer>
    </ImageBackground>
  );
}

const getStyles = (theme: AppTheme) => {
  return {
    ...StyleSheet.create({
      container: {
        flex: 1,
      },
      backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.85,
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 6, 8, 0.75)',
      },
      page: {
        paddingHorizontal: 24,
      },
      content: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingBottom: 48,
        rowGap: 20,
        width: '100%',
      },
      iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.brand.primarySoft,
        marginBottom: 8,
      },
      title: {
        textAlign: 'center',
      },
      description: {
        textAlign: 'center',
      },
      textContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        rowGap: 4,
      },
    }),
    iconAccent: { color: theme.brand.primary },
    iconSuccess: { color: theme.status.success.icon },
  };
};
