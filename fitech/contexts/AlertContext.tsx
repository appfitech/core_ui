import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { textStyles } from '@/constants/styles';
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

function resolveBodyText(title: string, message?: string) {
  if (message?.trim()) return message.trim();
  return title.trim();
}

function resolveActionButton(buttons: AlertButton[]) {
  return (
    buttons.find((b) => b.style !== 'cancel') ??
    buttons[buttons.length - 1] ?? { text: 'OK', onPress: () => {} }
  );
}

function resolveIcon(button: AlertButton): keyof typeof Ionicons.glyphMap {
  if (button.style === 'destructive') return 'warning-outline';
  return 'information-circle-outline';
}

function resolveButtonType(
  button: AlertButton,
): 'primary' | 'destructive' | 'tertiary' {
  if (button.style === 'destructive') return 'destructive';
  if (button.style === 'cancel') return 'tertiary';
  return 'primary';
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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

  const buttons = state.buttons ?? [];
  const bodyText = resolveBodyText(state.title, state.message);
  const actionButton = resolveActionButton(buttons);
  const iconName = resolveIcon(actionButton);
  const isDestructive = actionButton.style === 'destructive';

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
        <Animated.View entering={FadeIn.duration(160)} style={styles.backdrop}>
          <Pressable style={styles.backdropPress} onPress={hide} />
          <Animated.View
            entering={FadeInDown.springify().damping(20).stiffness(240)}
            style={styles.card}
          >
            <View style={styles.contentRow}>
              <View
                style={[
                  styles.iconWrap,
                  isDestructive && styles.iconWrapDestructive,
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isDestructive ? theme.errorText : theme.primaryText}
                />
              </View>
              <AppText variant="body" style={styles.body}>
                {bodyText}
              </AppText>
            </View>

            <View style={styles.footer}>
              <Button
                label={actionButton.text}
                type={resolveButtonType(actionButton)}
                onPress={() => handlePress(actionButton)}
                animated={false}
                style={styles.actionWrap}
                buttonStyle={styles.actionButton}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </AlertContext.Provider>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    backdropPress: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(5, 6, 8, 0.75)',
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        android: { elevation: 10 },
      }),
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: 12,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primaryBg,
      flexShrink: 0,
    },
    iconWrapDestructive: {
      backgroundColor: theme.errorBackground,
    },
    body: {
      ...text.body,
      flex: 1,
      color: theme.textPrimary,
      textAlign: 'left',
      paddingTop: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
    },
    actionWrap: {
      alignSelf: 'flex-end',
    },
    actionButton: {
      minHeight: 40,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
};
