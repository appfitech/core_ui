import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';
import { TrainerService } from '@/types/trainer';

type Props = {
  service: TrainerService;
  onHire: () => void;
};

const { trainerProfileScreen: copy } = TRANSLATIONS;

export function TrainerServiceCard({ service, onHire }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      <AppText style={styles.title} numberOfLines={2}>
        {service.name}
      </AppText>

      {service.description ? (
        <AppText style={styles.description} numberOfLines={3}>
          {service.description}
        </AppText>
      ) : null}

      <View style={styles.priceRow}>
        <Ionicons name="cash-outline" size={15} color={theme.text.tertiary} />
        <AppText style={styles.priceText}>
          {copy.price.replace('{amount}', service.totalPrice.toFixed(2))}
        </AppText>
      </View>

      <View style={styles.footer}>
        <Button
          label={copy.hireService}
          onPress={onHire}
          type="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    card: {
      backgroundColor: theme.background.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border.default,
      padding: 14,
      rowGap: 8,
    },
    title: {
      ...text.linkSemibold,
      color: theme.text.primary,
    },
    description: {
      ...text.small,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    priceText: {
      ...text.small,
      flex: 1,
      color: theme.text.secondary,
    },
    footer: {
      marginTop: 4,
      paddingTop: 10,
    },
    button: {
      width: '100%',
    },
  });
};
