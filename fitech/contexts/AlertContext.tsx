import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  title: string;
  message?: string;
  buttons?: AlertButton[];
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}

type AlertState = AlertOptions & { visible: boolean };

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [state, setState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const hide = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const showAlert = useCallback((options: AlertOptions) => {
    const buttons =
      options.buttons && options.buttons.length > 0
        ? options.buttons
        : [{ text: 'OK', onPress: () => {} }];
    setState({
      visible: true,
      title: options.title,
      message: options.message ?? '',
      buttons,
    });
  }, []);

  const handlePress = useCallback(
    (button: AlertButton) => {
      hide();
      button.onPress?.();
    },
    [hide],
  );

  const styles = getStyles(theme);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={state.visible}
        transparent
        animationType="fade"
        statusBarTranslucent={Platform.OS === 'android'}
        onRequestClose={hide}
      >
        <Pressable style={styles.backdrop} onPress={hide}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <AppText style={styles.title}>{state.title}</AppText>
            {state.message ? (
              <AppText style={styles.message}>{state.message}</AppText>
            ) : null}
            <View style={styles.buttons}>
              {state.buttons!.length === 1 ? (
                <Button
                  label={state.buttons![0].text}
                  onPress={() => handlePress(state.buttons![0])}
                  type="primary"
                  style={styles.singleButton}
                />
              ) : (
                state.buttons!.map((btn, i) => (
                  <Button
                    key={i}
                    label={btn.text}
                    onPress={() => handlePress(btn)}
                    type={
                      btn.style === 'destructive'
                        ? 'destructive'
                        : btn.style === 'cancel'
                          ? 'tertiary'
                          : 'primary'
                    }
                    style={styles.multiButton}
                  />
                ))
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AlertContext.Provider>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    card: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: theme.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 24,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    message: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    buttons: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      flexWrap: 'wrap',
    },
    singleButton: {
      minWidth: 120,
    },
    multiButton: {
      flex: 1,
      minWidth: 100,
    },
  });
