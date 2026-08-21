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
const SCROLL_TAIL_THRESHOLD = 12;
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
  const paddedHeight = contentHeight + INPUT_PADDING_VERTICAL * 2;
  return Math.min(MAX_INPUT_HEIGHT, Math.max(MIN_INPUT_HEIGHT, paddedHeight));
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
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const [followTail, setFollowTail] = useState(true);

  const scrollEnabled = inputHeight >= MAX_INPUT_HEIGHT;

  const scrollToInputEnd = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollToEnd({ animated: false });
    });
  }, []);

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const nextHeight = clampInputHeight(event.nativeEvent.contentSize.height);
      setInputHeight((current) =>
        current === nextHeight ? current : nextHeight,
      );
    },
    [],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text);
      if (followTail) {
        scrollToInputEnd();
      }
    },
    [followTail, onChangeText, scrollToInputEnd],
  );

  const handleScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number };
        contentSize: { height: number };
        layoutMeasurement: { height: number };
      };
    }) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);
      const isAtTail = distanceFromBottom <= SCROLL_TAIL_THRESHOLD;
      setFollowTail((current) => (current === isAtTail ? current : isAtTail));
    },
    [],
  );

  useEffect(() => {
    if (!value) {
      setInputHeight(MIN_INPUT_HEIGHT);
      setFollowTail(true);
      return;
    }

    if (followTail) {
      scrollToInputEnd();
    }
  }, [followTail, inputHeight, scrollToInputEnd, value]);

  const trimmed = value.trim();
  const canSend = !disabled && trimmed.length > 0;

  const handleSendPress = useCallback(() => {
    if (!canSend) return;
    onSend();
  }, [canSend, onSend]);

  return (
    <View style={[styles.root, disabled && styles.rootDisabled]}>
      <View style={styles.inputRow}>
        <View style={[styles.inputShell, { height: inputHeight }]}>
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
            onScroll={scrollEnabled ? handleScroll : undefined}
            scrollEventThrottle={16}
            textAlignVertical="top"
            lineBreakModeIOS="wordWrapping"
            textBreakStrategy="highQuality"
            autoCapitalize="sentences"
            autoCorrect
            spellCheck
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
