import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteAccount } from '@/lib/api/mutations/use-account-mutations';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

export default function DeleteAccountScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { showAlert } = useAlert();
  const { deleteAccountScreen } = TRANSLATIONS;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const performDelete = useCallback(() => {
    setErrorMsg(null);

    deleteAccount(undefined, {
      onSuccess: async () => {
        await useUserStore.getState().logout();
        showAlert({
          title: deleteAccountScreen.successTitle,
          message: deleteAccountScreen.successMessage,
          buttons: [
            {
              text: deleteAccountScreen.successButton,
              onPress: () => router.replace(ROUTES.login),
            },
          ],
        });
      },
      onError: (error) => {
        setErrorMsg(
          extractErrorMessage(error, deleteAccountScreen.errorFallback),
        );
      },
    });
  }, [
    deleteAccount,
    deleteAccountScreen,
    router,
    showAlert,
  ]);

  const handleConfirmDelete = useCallback(() => {
    showAlert({
      title: deleteAccountScreen.confirmTitle,
      message: deleteAccountScreen.confirmMessage,
      buttons: [
        { text: deleteAccountScreen.confirmCancel, style: 'cancel' },
        {
          text: deleteAccountScreen.confirmAction,
          style: 'destructive',
          onPress: performDelete,
        },
      ],
    });
  }, [deleteAccountScreen, performDelete, showAlert]);

  return (
    <PageContainer title={deleteAccountScreen.title} style={styles.page}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="warning-outline"
          size={40}
          color={theme.status.error.icon}
        />
      </View>

      <AppText variant="sectionTitle" style={styles.introTitle}>
        {deleteAccountScreen.introTitle}
      </AppText>

      <View style={styles.bulletList}>
        {deleteAccountScreen.bullets.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <AppText style={styles.bulletMarker}>•</AppText>
            <AppText variant="body" style={styles.bulletText}>
              {item}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="caption" style={styles.note}>
        {deleteAccountScreen.note}
      </AppText>

      <ErrorBanner
        errorMessage={errorMsg}
        onClear={() => setErrorMsg(null)}
      />

      <View style={styles.actions}>
        <Button
          type="destructive"
          label={deleteAccountScreen.confirmButton}
          loadingLabel={deleteAccountScreen.deletingButton}
          loading={isPending}
          onPress={handleConfirmDelete}
          animated={false}
          style={styles.actionButton}
        />
        <Button
          type="secondary"
          label={deleteAccountScreen.cancelButton}
          onPress={handleCancel}
          disabled={isPending}
          animated={false}
          style={styles.actionButton}
        />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    page: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: theme.status.error.bg,
      marginBottom: 16,
      marginTop: 8,
    },
    introTitle: {
      textAlign: 'center',
      marginBottom: 16,
      color: theme.text.primary,
    },
    bulletList: {
      rowGap: 12,
      marginBottom: 20,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 10,
    },
    bulletMarker: {
      color: theme.status.error.text,
      fontSize: 18,
      lineHeight: 22,
    },
    bulletText: {
      flex: 1,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    note: {
      color: theme.text.tertiary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    actions: {
      rowGap: 12,
    },
    actionButton: {
      width: '100%',
    },
  });
