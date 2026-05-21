import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { AnimatedAppText } from '@/components/AnimatedAppText';
import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { TRANSLATIONS } from '@/constants/strings';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useForgotPassword } from '@/lib/api/mutations/use-account-mutations';
import { AppTheme } from '@/types/theme';
import { extractErrorMessage } from '@/utils/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { showAlert } = useAlert();
  const { forgotPasswordScreen } = TRANSLATIONS;

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = useCallback(() => {
    const trimmed = email.trim();

    if (!trimmed) {
      setErrorMsg(forgotPasswordScreen.emailRequired);
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setErrorMsg(forgotPasswordScreen.emailInvalid);
      return;
    }

    setErrorMsg(null);

    forgotPassword(trimmed, {
      onSuccess: () => {
        showAlert({
          title: forgotPasswordScreen.successTitle,
          message: forgotPasswordScreen.successMessage,
          buttons: [{ text: 'Entendido', onPress: () => router.back() }],
        });
      },
      onError: (error) => {
        setErrorMsg(
          extractErrorMessage(error, forgotPasswordScreen.errorFallback),
        );
      },
    });
  }, [email, forgotPassword, forgotPasswordScreen, router, showAlert]);

  return (
    <ImageBackground
      source={require('@/assets/images/backgrounds/forgot_password_bg.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} pointerEvents="none" />
      <PageContainer
        authOptimized
        transparentBackground
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
              {forgotPasswordScreen.title}
            </AnimatedAppText>

            <AnimatedAppText variant="subheader" style={styles.description}>
              {forgotPasswordScreen.description}
            </AnimatedAppText>
          </View>
          <ErrorBanner
            errorMessage={errorMsg}
            onClear={() => setErrorMsg(null)}
          />

          <TextInput
            startElement={
              <Ionicons name="at" size={20} color={styles.iconColor.color} />
            }
            label={forgotPasswordScreen.emailLabel}
            required
            value={email}
            onChangeText={setEmail}
            placeholder={forgotPasswordScreen.emailPlaceholder}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            label={forgotPasswordScreen.submitButton}
            onPress={handleSubmit}
            disabled={!email.trim() || isPending}
            loading={isPending}
            loadingLabel={TRANSLATIONS.common.sending}
            animated={false}
          />
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
        backgroundColor: 'rgba(5, 6, 8, 0.85)',
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
    iconColor: { color: theme.icon.secondary },
    iconAccent: { color: theme.brand.primary },
  };
};
