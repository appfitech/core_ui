import { useEffect, useRef, useState } from 'react';
import { Platform, type TextInputProps } from 'react-native';

type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

type Options = {
  value: string | undefined;
  onChangeText: ((text: string) => void) | undefined;
  enabled: boolean;
  onFocus?: FocusHandler;
  onBlur?: BlurHandler;
};

/**
 * Android: while focused, keeps typed text in local state so parent re-renders
 * do not reset the native input and drop characters. Parent still receives
 * onChangeText on every keystroke (chat, search, validation keep working).
 */
export function useAndroidControlledTextBuffer({
  value,
  onChangeText,
  enabled,
  onFocus,
  onBlur,
}: Options) {
  const externalValue = value ?? '';
  const [localValue, setLocalValue] = useState(externalValue);
  const isFocusedRef = useRef(false);
  const localRef = useRef(externalValue);

  useEffect(() => {
    localRef.current = externalValue;
    if (!isFocusedRef.current) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return () => {
      if (isFocusedRef.current) {
        onChangeText?.(localRef.current);
      }
    };
  }, [enabled, onChangeText]);

  if (!enabled) {
    return {
      displayValue: value,
      handleChangeText: onChangeText,
      handleFocus: onFocus,
      handleBlur: onBlur,
      bufferActive: false,
    };
  }

  return {
    displayValue: localValue,
    bufferActive: true,
    handleChangeText: (text: string) => {
      localRef.current = text;
      setLocalValue(text);
      onChangeText?.(text);
    },
    handleFocus: ((e) => {
      isFocusedRef.current = true;
      onFocus?.(e);
    }) as FocusHandler,
    handleBlur: ((e) => {
      isFocusedRef.current = false;
      onChangeText?.(localRef.current);
      onBlur?.(e);
    }) as BlurHandler,
  };
}

export function shouldUseAndroidTextBuffer(
  value: string | undefined,
  onChangeText: ((text: string) => void) | undefined,
  disableAndroidInputBuffer: boolean | undefined,
): boolean {
  return (
    Platform.OS === 'android' &&
    !disableAndroidInputBuffer &&
    value !== undefined &&
    onChangeText !== undefined
  );
}
