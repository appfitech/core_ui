import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

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
  const titleText = title.trim();
  const messageText = message?.trim() ?? '';

  if (messageText && titleText && messageText !== titleText) {
    return `${titleText}\n\n${messageText}`;
  }

  if (messageText) return messageText;
  return titleText;
}

function resolveIcon(buttons: AlertButton[]): keyof typeof Ionicons.glyphMap {
  const primary =
    buttons.find((b) => b.style === 'destructive') ??
    buttons.find((b) => b.style !== 'cancel') ??
    buttons[buttons.length - 1];
  const button = primary ?? { text: 'OK' };
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
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
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
  const iconName = resolveIcon(buttons);
  const isDestructive = buttons.some((b) => b.style === 'destructive');
  const isStacked = buttons.length > 2;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <View style={styles.host}>
        {children}

        {state.visible ? (
          <View
            style={[
              styles.overlay,
              {
                width: windowWidth,
                height: windowHeight,
              },
            ]}
            accessibilityViewIsModal
            importantForAccessibility="yes"
          >
            <Pressable
              style={styles.backdrop}
              onPress={hide}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            />

            <View
              style={[
                styles.center,
                {
                  paddingTop: insets.top + 24,
                  paddingBottom: insets.bottom + 24,
                  paddingHorizontal: 20,
                },
              ]}
              pointerEvents="box-none"
            >
              <View
                style={styles.card}
                onStartShouldSetResponder={() => true}
                accessibilityRole="alert"
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
                      color={
                        isDestructive
                          ? theme.status.error.text
                          : theme.brand.primaryLight
                      }
                    />
                  </View>
                  <AppText variant="body" style={styles.body}>
                    {bodyText}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.footer,
                    isStacked ? styles.footerStacked : styles.footerInline,
                  ]}
                >
                  {buttons.map((button, index) => (
                    <Button
                      key={`${button.text}-${index}`}
                      label={button.text}
                      type={resolveButtonType(button)}
                      onPress={() => handlePress(button)}
                      animated={false}
                      style={
                        isStacked
                          ? styles.footerButtonStacked
                          : styles.footerButtonInline
                      }
                      buttonStyle={styles.actionButton}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </AlertContext.Provider>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);

  return StyleSheet.create({
    host: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10000,
      elevation: 10000,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.background.overlay,
    },
    center: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.background.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.default,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOpacity: 0.45,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
        },
        android: { elevation: 28 },
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
      backgroundColor: theme.brand.primarySoft,
      flexShrink: 0,
    },
    iconWrapDestructive: {
      backgroundColor: theme.status.error.bg,
    },
    body: {
      ...text.body,
      flex: 1,
      color: theme.text.primary,
      textAlign: 'left',
      paddingTop: 8,
    },
    footer: {
      marginTop: 16,
      gap: 10,
    },
    footerInline: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    footerStacked: {
      flexDirection: 'column',
    },
    footerButtonInline: {
      alignSelf: 'flex-end',
    },
    footerButtonStacked: {
      alignSelf: 'stretch',
    },
    actionButton: {
      minHeight: 40,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
};
