import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';

import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types/theme';

const LINE_HEIGHT = 22;
const INPUT_PADDING_VERTICAL = 8;
const MIN_INPUT_HEIGHT = LINE_HEIGHT + INPUT_PADDING_VERTICAL * 2;
const MAX_INPUT_HEIGHT = LINE_HEIGHT * 4 + INPUT_PADDING_VERTICAL * 2;
const HEIGHT_EPSILON = 2;
const SEND_BUTTON_SIZE = 44;

/** Space reserved at bottom of message list (max composer + chrome). */
export const CHAT_COMPOSER_RESERVE =
  MAX_INPUT_HEIGHT + 8 + 1 + Math.max(SEND_BUTTON_SIZE - MIN_INPUT_HEIGHT, 0);

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onFocus: () => void;
  placeholder?: string;
  disabled?: boolean;
};

function clampInputHeight(contentHeight: number): number {
  return Math.min(
    MAX_INPUT_HEIGHT,
    Math.max(MIN_INPUT_HEIGHT, Math.ceil(contentHeight)),
  );
}

export function ChatMessageComposer({
  value,
  onChangeText,
  onSend,
  onFocus,
  placeholder = 'Escribe un mensaje...',
  disabled = false,
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const inputRef = useRef<NativeTextInput>(null);
  const [contentHeight, setContentHeight] = useState(MIN_INPUT_HEIGHT);

  const scrollEnabled = contentHeight >= MAX_INPUT_HEIGHT - HEIGHT_EPSILON;

  useEffect(() => {
    if (!value) {
      setContentHeight(MIN_INPUT_HEIGHT);
    }
  }, [value]);

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const nextHeight = clampInputHeight(event.nativeEvent.contentSize.height);
      setContentHeight((current) =>
        Math.abs(current - nextHeight) <= HEIGHT_EPSILON ? current : nextHeight,
      );
    },
    [],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text);

      if (!text) {
        setContentHeight(MIN_INPUT_HEIGHT);
        return;
      }

      if (scrollEnabled) {
        requestAnimationFrame(() => {
          const input = inputRef.current as NativeTextInput & {
            scrollToEnd?: (options?: { animated?: boolean }) => void;
          };
          input?.scrollToEnd?.({ animated: false });
        });
      }
    },
    [onChangeText, scrollEnabled],
  );

  const trimmed = value.trim();
  const canSend = !disabled && trimmed.length > 0;

  const handleSendPress = useCallback(() => {
    if (!canSend) return;
    onSend();
  }, [canSend, onSend]);

  return (
    <View style={[styles.root, disabled && styles.rootDisabled]}>
      <View style={styles.inputRow}>
        <View style={styles.inputShell}>
          <NativeTextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor={theme.icon.muted}
            editable={!disabled}
            multiline
            scrollEnabled={scrollEnabled}
            blurOnSubmit={false}
            onContentSizeChange={handleContentSizeChange}
            textAlignVertical="top"
            {...(Platform.OS === 'ios'
              ? { lineBreakModeIOS: 'char' as const }
              : null)}
            autoCapitalize="sentences"
            autoCorrect
            spellCheck
            style={[
              styles.input,
              scrollEnabled ? styles.inputAtMaxHeight : null,
              Platform.OS === 'android' ? styles.inputAndroid : null,
            ]}
            {...(Platform.OS === 'android'
              ? { textBreakStrategy: 'simple' as const }
              : null)}
          />
        </View>

        <Pressable
          onPress={handleSendPress}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
          accessibilityState={{ disabled: !canSend }}
          style={({ pressed }) => [
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            pressed && canSend && styles.sendButtonPressed,
          ]}
        >
          <Ionicons
            name="send"
            size={20}
            color={canSend ? theme.button.primaryText : theme.text.disabled}
            style={styles.sendIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}

export { MIN_INPUT_HEIGHT as CHAT_COMPOSER_MIN_HEIGHT, SEND_BUTTON_SIZE };

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    root: {
      width: '100%',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      backgroundColor: theme.background.app,
    },
    rootDisabled: {
      opacity: 0.55,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      columnGap: 8,
    },
    inputShell: {
      flex: 1,
      minWidth: 0,
      borderRadius: 22,
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
      overflow: 'hidden',
    },
    input: {
      ...text.body,
      width: '100%',
      minHeight: MIN_INPUT_HEIGHT,
      maxHeight: MAX_INPUT_HEIGHT,
      color: theme.text.primary,
      paddingHorizontal: 14,
      paddingVertical: INPUT_PADDING_VERTICAL,
      lineHeight: LINE_HEIGHT,
      fontSize: 16,
      backgroundColor: 'transparent',
    },
    inputAtMaxHeight: {
      height: MAX_INPUT_HEIGHT,
    },
    inputAndroid: {
      includeFontPadding: false,
      textAlignVertical: 'top',
    },
    sendButton: {
      width: SEND_BUTTON_SIZE,
      height: SEND_BUTTON_SIZE,
      borderRadius: SEND_BUTTON_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonActive: {
      backgroundColor: theme.brand.primary,
    },
    sendButtonDisabled: {
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    sendButtonPressed: {
      backgroundColor: theme.brand.primaryDark,
    },
    sendIcon: {
      marginLeft: 2,
    },
  });
};
