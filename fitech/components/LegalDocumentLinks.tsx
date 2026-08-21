import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

export function LegalDocumentLinks() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { legalDocuments: copy } = TRANSLATIONS;

  const handleOpenTerms = useCallback(() => {
    router.push(ROUTES.termsAndConditions);
  }, [router]);

  const handleOpenPrivacy = useCallback(() => {
    router.push(ROUTES.privacyPolicy);
  }, [router]);

  return (
    <View style={styles.wrap}>
      <AppText style={styles.text}>
        {copy.registerPrefix}{' '}
        <AppText style={styles.link} onPress={handleOpenTerms}>
          {copy.termsLabel}
        </AppText>
        {copy.registerMiddle}{' '}
        <AppText style={styles.link} onPress={handleOpenPrivacy}>
          {copy.privacyLabel}
        </AppText>
        .
      </AppText>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    wrap: {
      width: '100%',
    },
    text: {
      ...text.caption,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    link: {
      ...text.captionSemibold,
      color: theme.brand.primary,
    },
  });
};
