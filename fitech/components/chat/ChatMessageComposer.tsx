import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
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
const MAX_VISIBLE_LINES = 4;
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
};

function getApproxCharsPerLine(): number {
  const pagePadding = 32;
  const inputPadding = 28;
  const sendAndGap = SEND_BUTTON_SIZE + 8;
  const available =
    Dimensions.get('window').width - pagePadding - inputPadding - sendAndGap;
  return Math.max(14, Math.floor(available / 8));
}

function countVisualLines(text: string, charsPerLine: number): number {
  if (!text) return 1;

  return text.split('\n').reduce((total, line) => {
    return total + Math.max(1, Math.ceil(line.length / charsPerLine));
  }, 0);
}

function estimateComposerHeight(text: string): number {
  const charsPerLine = getApproxCharsPerLine();
  const visualLines = countVisualLines(text, charsPerLine);
  const cappedLines = Math.min(MAX_VISIBLE_LINES, Math.max(1, visualLines));

  return Math.min(
    MAX_INPUT_HEIGHT,
    Math.max(MIN_INPUT_HEIGHT, cappedLines * LINE_HEIGHT + INPUT_PADDING_VERTICAL * 2),
  );
}

export function ChatMessageComposer({
  value,
  onChangeText,
  onSend,
  onFocus,
  placeholder = 'Escribe un mensaje...',
}: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [contentOverflows, setContentOverflows] = useState(false);

  const estimatedLines = useMemo(() => {
    const charsPerLine = getApproxCharsPerLine();
    return countVisualLines(value, charsPerLine);
  }, [value]);

  const estimatedHeight = useMemo(
    () => estimateComposerHeight(value),
    [value],
  );

  const scrollEnabled =
    contentOverflows || estimatedLines >= MAX_VISIBLE_LINES;
  const inputHeight = scrollEnabled ? MAX_INPUT_HEIGHT : estimatedHeight;
  const isMultiline = inputHeight > MIN_INPUT_HEIGHT + 2;

  useEffect(() => {
    if (!value) {
      setContentOverflows(false);
    }
  }, [value]);

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const overflows = contentHeight + INPUT_PADDING_VERTICAL * 2 > MAX_INPUT_HEIGHT;
      setContentOverflows((current) =>
        current === overflows ? current : overflows,
      );
    },
    [],
  );

  const trimmed = value.trim();
  const canSend = trimmed.length > 0;

  const handleSendPress = useCallback(() => {
    if (!canSend) return;
    onSend();
  }, [canSend, onSend]);

  return (
    <View style={styles.root}>
      <View style={styles.inputRow}>
        <View style={[styles.inputShell, { height: inputHeight }]}>
          <NativeTextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor={theme.icon.muted}
            multiline
            scrollEnabled={scrollEnabled}
            blurOnSubmit={false}
            onContentSizeChange={handleContentSizeChange}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            lineBreakModeIOS="char"
            textBreakStrategy="simple"
            autoCapitalize="sentences"
            autoCorrect
            showsVerticalScrollIndicator={scrollEnabled}
            style={[
              styles.input,
              {
                height: inputHeight,
                maxHeight: MAX_INPUT_HEIGHT,
              },
              Platform.OS === 'android' ? styles.inputAndroid : null,
            ]}
          />
        </View>

        <Pressable
          onPress={handleSendPress}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
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
      flexShrink: 1,
      width: '100%',
      color: theme.text.primary,
      paddingHorizontal: 14,
      paddingVertical: INPUT_PADDING_VERTICAL,
      lineHeight: LINE_HEIGHT,
      fontSize: 16,
      backgroundColor: 'transparent',
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
