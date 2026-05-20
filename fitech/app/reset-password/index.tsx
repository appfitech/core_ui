import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedAppText } from '@/components/AnimatedAppText';
import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { useResetPassword } from '@/lib/api/mutations/use-account-mutations';
import { FullTheme } from '@/types/theme';
import { resolveTokenFromParams } from '@/utils/deep-link';
import {
  extractErrorMessage,
  resolveResetPasswordError,
} from '@/utils/errors';

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { resetPasswordScreen } = TRANSLATIONS;

  const params = useLocalSearchParams<{
    token?: string | string[];
    resetToken?: string | string[];
    reset_token?: string | string[];
  }>();
  const token = resolveTokenFromParams(params);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayPass, setDisplayPass] = useState(false);
  const [displayConfirmPass, setDisplayConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  const handleSubmit = useCallback(() => {
    if (!token) {
      setErrorMsg(resetPasswordScreen.missingToken);
      return;
    }

    const trimmed = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmed) {
      setErrorMsg(resetPasswordScreen.passwordRequired);
      return;
    }

    if (trimmed.length < MIN_PASSWORD_LENGTH) {
      setErrorMsg(resetPasswordScreen.passwordTooShort);
      return;
    }

    if (!trimmedConfirm) {
      setErrorMsg(resetPasswordScreen.confirmRequired);
      return;
    }

    if (trimmed !== trimmedConfirm) {
      setErrorMsg(resetPasswordScreen.passwordsMismatch);
      return;
    }

    setErrorMsg(null);

    resetPassword(
      { token, newPassword: trimmed },
      {
        onError: (error) => {
          setErrorMsg(
            resolveResetPasswordError(error, {
              invalidToken: resetPasswordScreen.invalidToken,
              fallback: resetPasswordScreen.errorFallback,
            }),
          );
        },
      },
    );
  }, [
    confirmPassword,
    password,
    resetPassword,
    resetPasswordScreen,
    token,
  ]);

  const handleGoToLogin = useCallback(() => {
    router.replace(ROUTES.login);
  }, [router]);

  if (!token) {
    return (
      <PageContainer
        hasBackButton={false}
        hasBottomPadding={false}
        hasNoTopPadding
        contentPaddingBottom={32}
        style={styles.page}
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={styles.iconAccent.color}
            />
          </View>
          <AnimatedAppText variant="sectionTitle" style={styles.title}>
            {resetPasswordScreen.title}
          </AnimatedAppText>
          <AnimatedAppText variant="subheader" style={styles.description}>
            {resetPasswordScreen.missingToken}
          </AnimatedAppText>
          <Button
            label={resetPasswordScreen.goToLogin}
            onPress={handleGoToLogin}
            animated={false}
          />
        </View>
      </PageContainer>
    );
  }

  if (isSuccess) {
    return (
      <PageContainer
        hasBackButton={false}
        hasBottomPadding={false}
        hasNoTopPadding
        contentPaddingBottom={32}
        style={styles.page}
      >
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark-circle-outline"
              size={40}
              color={styles.iconSuccess.color}
            />
          </View>
          <AnimatedAppText variant="sectionTitle" style={styles.title}>
            {resetPasswordScreen.successTitle}
          </AnimatedAppText>
          <AnimatedAppText variant="subheader" style={styles.description}>
            {resetPasswordScreen.successMessage}
          </AnimatedAppText>
          <Button
            label={resetPasswordScreen.goToLogin}
            onPress={handleGoToLogin}
            animated={false}
          />
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      authOptimized
      hasBackButton
      hasBottomPadding={false}
      hasNoTopPadding
      contentPaddingBottom={32}
      style={styles.page}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="lock-closed-outline"
            size={36}
            color={styles.iconAccent.color}
          />
        </View>

        <View style={styles.textContainer}>
          <AnimatedAppText variant="sectionTitle" style={styles.title}>
            {resetPasswordScreen.title}
          </AnimatedAppText>
          <AnimatedAppText variant="subheader" style={styles.description}>
            {resetPasswordScreen.description}
          </AnimatedAppText>
        </View>

        <ErrorBanner errorMessage={errorMsg} onClear={() => setErrorMsg(null)} />

        <TextInput
          startElement={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={styles.iconColor.color}
            />
          }
          endElement={
            <TouchableOpacity onPress={() => setDisplayPass((v) => !v)}>
              <Ionicons
                name={displayPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={styles.iconColor.color}
              />
            </TouchableOpacity>
          }
          label={resetPasswordScreen.passwordLabel}
          required
          secureTextEntry={!displayPass}
          value={password}
          onChangeText={setPassword}
          placeholder={resetPasswordScreen.passwordPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          startElement={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={styles.iconColor.color}
            />
          }
          endElement={
            <TouchableOpacity onPress={() => setDisplayConfirmPass((v) => !v)}>
              <Ionicons
                name={displayConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={styles.iconColor.color}
              />
            </TouchableOpacity>
          }
          label={resetPasswordScreen.confirmPasswordLabel}
          required
          secureTextEntry={!displayConfirmPass}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={resetPasswordScreen.confirmPasswordPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          label={
            isPending
              ? `${resetPasswordScreen.submitButton}…`
              : resetPasswordScreen.submitButton
          }
          onPress={handleSubmit}
          disabled={isPending || !password.trim() || !confirmPassword.trim()}
          animated={false}
        />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  return {
    ...StyleSheet.create({
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
    iconColor: { color: theme.icon.secondary },
    iconAccent: { color: theme.brand.primary },
    iconSuccess: { color: theme.status.success.icon },
  };
};
