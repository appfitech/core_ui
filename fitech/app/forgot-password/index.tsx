import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedAppText } from '@/components/AnimatedAppText';
import { Button } from '@/components/Button';
import { ErrorBanner } from '@/components/ErrorBanner';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { showInfoToast } from '@/components/Toast';
import { TRANSLATIONS } from '@/constants/strings';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { forgotPasswordScreen } = TRANSLATIONS;

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    // TODO: wire forgot-password API when available
    setTimeout(() => {
      setIsSubmitting(false);
      showInfoToast(
        forgotPasswordScreen.successTitle,
        forgotPasswordScreen.successMessage,
      );
      router.back();
    }, 600);
  }, [email, forgotPasswordScreen, router]);

  return (
    <PageContainer
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
          disabled={!email.trim() || isSubmitting}
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
        backgroundColor: theme.primaryBg,
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
    iconColor: { color: theme.dark800 },
    iconAccent: { color: theme.primary },
  };
};
