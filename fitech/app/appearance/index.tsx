import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from '@/components/AppText';
import PageContainer from '@/components/PageContainer';

export default function AppearanceScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <PageContainer
      title="Apariencia"
      subheader="Fitech usa el tema oscuro Kinetic Obsidian de forma fija."
      style={styles.container}
    >
      <View style={styles.card}>
        <Ionicons name="moon" size={28} color={theme.primary} />
        <AppText style={styles.title}>Kinetic Obsidian</AppText>
        <AppText style={styles.body}>
          Modo claro y tema del sistema ya no están disponibles. La interfaz
          usa fondo obsidiana, acentos en verde cinético y tipografía de alto
          contraste.
        </AppText>
      </View>
    </PageContainer>
  );
}

function getStyles(theme: FullTheme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    card: {
      marginTop: 8,
      padding: 20,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSecondary,
    },
  });
}
