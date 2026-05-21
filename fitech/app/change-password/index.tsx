import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ErrorBanner } from '@/components/ErrorBanner';
import { FooterActions } from '@/components/FooterActions';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { clearAppQueryCache } from '@/lib/api/mutation-cache';
import { useChangePassword } from '@/lib/api/mutations/use-account-mutations';
import { useUserStore } from '@/stores/user';
import { AppTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

const MIN_PASSWORD_LENGTH = 6;

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { changePasswordScreen } = TRANSLATIONS;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayCurrent, setDisplayCurrent] = useState(false);
  const [displayNew, setDisplayNew] = useState(false);
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: changePassword, isPending } = useChangePassword();

  const validate = useCallback((): string | null => {
    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current) return changePasswordScreen.currentRequired;
    if (!next) return changePasswordScreen.passwordRequired;
    if (next.length < MIN_PASSWORD_LENGTH) {
      return changePasswordScreen.passwordTooShort;
    }
    if (!confirm) return changePasswordScreen.confirmRequired;
    if (next !== confirm) return changePasswordScreen.passwordsMismatch;
    if (current === next) return changePasswordScreen.sameAsCurrent;

    return null;
  }, [changePasswordScreen, confirmPassword, currentPassword, newPassword]);

  const performChange = useCallback(() => {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg(null);

    changePassword(
      {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      },
      {
        onSuccess: async () => {
          clearAppQueryCache(queryClient);
          await useUserStore.getState().logout();
          showAlert({
            title: changePasswordScreen.successTitle,
            message: changePasswordScreen.successMessage,
            buttons: [
              {
                text: changePasswordScreen.successButton,
                onPress: () => router.replace(ROUTES.login),
              },
            ],
          });
        },
        onError: (error) => {
          setErrorMsg(
            extractErrorMessage(error, changePasswordScreen.errorFallback),
          );
        },
      },
    );
  }, [
    changePassword,
    changePasswordScreen,
    currentPassword,
    newPassword,
    queryClient,
    router,
    showAlert,
    validate,
  ]);

  const handleSubmitPress = useCallback(() => {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    showAlert({
      title: changePasswordScreen.confirmTitle,
      message: changePasswordScreen.confirmMessage,
      buttons: [
        { text: changePasswordScreen.confirmCancel, style: 'cancel' },
        {
          text: changePasswordScreen.confirmAction,
          onPress: performChange,
        },
      ],
    });
  }, [changePasswordScreen, performChange, showAlert, validate]);

  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= MIN_PASSWORD_LENGTH &&
    confirmPassword.trim().length > 0;

  return (
    <PageContainer
      title={changePasswordScreen.title}
      style={styles.page}
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={
        <FooterActions
          primaryLabel={changePasswordScreen.submitButton}
          onPrimary={handleSubmitPress}
          cancelLabel={changePasswordScreen.cancelButton}
          onCancel={() => router.back()}
          primaryDisabled={!canSubmit}
          primaryLoading={isPending}
          cancelDisabled={isPending}
        />
      }
    >
      <View style={styles.introCard}>
        <AppText variant="bodySemibold" style={styles.introTitle}>
          {changePasswordScreen.introTitle}
        </AppText>
        <AppText variant="caption" style={styles.introBody}>
          {changePasswordScreen.introBody}
        </AppText>
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
          <TouchableOpacity onPress={() => setDisplayCurrent((v) => !v)}>
            <Ionicons
              name={displayCurrent ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={styles.iconColor.color}
            />
          </TouchableOpacity>
        }
        label={changePasswordScreen.currentPasswordLabel}
        required
        secureTextEntry={!displayCurrent}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder={changePasswordScreen.currentPasswordPlaceholder}
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
          <TouchableOpacity onPress={() => setDisplayNew((v) => !v)}>
            <Ionicons
              name={displayNew ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={styles.iconColor.color}
            />
          </TouchableOpacity>
        }
        label={changePasswordScreen.newPasswordLabel}
        required
        secureTextEntry={!displayNew}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder={changePasswordScreen.newPasswordPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        newPasswordAutofill
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
          <TouchableOpacity onPress={() => setDisplayConfirm((v) => !v)}>
            <Ionicons
              name={displayConfirm ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={styles.iconColor.color}
            />
          </TouchableOpacity>
        }
        label={changePasswordScreen.confirmPasswordLabel}
        required
        secureTextEntry={!displayConfirm}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={changePasswordScreen.confirmPasswordPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  return {
    ...StyleSheet.create({
      page: {
        paddingHorizontal: 16,
        rowGap: 16,
        paddingBottom: 0,
      },
      introCard: {
        backgroundColor: theme.status.warning.bg,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.status.warning.border,
        rowGap: 8,
      },
      introTitle: {
        color: theme.status.warning.text,
      },
      introBody: {
        color: theme.status.warning.text,
        lineHeight: 20,
      },
    }),
    iconColor: { color: theme.icon.secondary },
  };
};
