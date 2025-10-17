import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADING_STYLES, SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useGymBroStore } from '@/stores/gymBroStore';
import { useGymCrushStore } from '@/stores/gymcrushStore';
import { FullTheme } from '@/types/theme';

import { AppText } from '../components/AppText';
import PageContainer from '../components/PageContainer';

export default function Register() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  async function sendTestPush() {
    const expoPushToken = await AsyncStorage.getItem('@push_token_v1');

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title: '¡Tienes un nuevo gymbro! ❤️',
        body: 'Alguien hizo match contigo. Entra a FITECH y dile hola.',
        data: { navigateTo: '/gymbro' },
      }),
    });
  }

  return (
    <PageContainer style={{ padding: 16 }}>
      <View style={{}}>
        <AppText style={styles.header}>{'Testing tools'}</AppText>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          useGymBroStore.getState().clearAll();
          useGymCrushStore.getState().clearAll();
        }}
      >
        <AppText style={styles.submitText}>{'Resetear matches'}</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={sendTestPush}>
        <AppText style={styles.submitText}>
          {'Enviar test notification'}
        </AppText>
      </TouchableOpacity>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({ ...SHARED_STYLES(theme), ...HEADING_STYLES(theme) });
