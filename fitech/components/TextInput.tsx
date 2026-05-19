import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { formStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  shouldUseAndroidTextBuffer,
  useAndroidControlledTextBuffer,
} from '@/hooks/use-android-controlled-text-buffer';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Tag } from './Tag';

const MULTILINE_LINE_HEIGHT = 22;

type Props = TextInputProps & {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  label?: string;
  required?: boolean;
  /** Use on sign-up password fields so iOS offers a strong password once (not on confirm). */
  newPasswordAutofill?: boolean;
  /** Skip Android focus buffer (rare; default is on for controlled fields). */
  disableAndroidInputBuffer?: boolean;
};

function resolveSecureTextProps(
  secureTextEntry: boolean | undefined,
  newPasswordAutofill: boolean | undefined,
  rest: TextInputProps,
): Pick<TextInputProps, 'textContentType' | 'autoComplete'> {
  if (!secureTextEntry) {
    return {};
  }

  if (rest.textContentType != null || rest.autoComplete != null) {
    return {
      textContentType: rest.textContentType,
      autoComplete: rest.autoComplete,
    };
  }

  if (newPasswordAutofill) {
    return {
      textContentType: 'newPassword',
      autoComplete: 'password-new',
    };
  }

  return {
    textContentType: 'password',
    autoComplete: Platform.OS === 'android' ? 'password' : 'off',
  };
}

export function TextInput(props: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    startElement = null,
    endElement = null,
    label = null,
    required = true,
    newPasswordAutofill = false,
    disableAndroidInputBuffer = false,
    secureTextEntry,
    style: inputStyleProp,
    value,
    onChangeText,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const useBuffer = shouldUseAndroidTextBuffer(
    value,
    onChangeText,
    disableAndroidInputBuffer,
  );

  const {
    displayValue,
    handleChangeText,
    handleFocus,
    handleBlur,
    bufferActive,
  } = useAndroidControlledTextBuffer({
    value,
    onChangeText,
    enabled: useBuffer,
    onFocus,
    onBlur,
  });

  const secureAutofillProps = resolveSecureTextProps(
    secureTextEntry,
    newPasswordAutofill,
    props,
  );

  const multiline = Boolean(props.multiline);
  const lineCount = multiline ? Math.max(props.numberOfLines ?? 4, 4) : 1;
  const multilineMinHeight = lineCount * MULTILINE_LINE_HEIGHT + 24;

  return (
    <View key={props.id ?? 'text-input'} style={styles.field}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText style={styles.label}>{label}</AppText>
          {!required && (
            <Tag
              backgroundColor={theme.status.warning.bg}
              textColor={theme.status.warning.text}
              style={styles.optionalTag}
              label="Opcional"
            />
          )}
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          multiline && { minHeight: multilineMinHeight },
        ]}
      >
        {startElement && (
          <View style={styles.startElement}>{startElement}</View>
        )}
        <NativeTextInput
          {...rest}
          {...secureAutofillProps}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          importantForAutofill={
            bufferActive ? 'no' : rest.importantForAutofill
          }
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          scrollEnabled={multiline ? false : rest.scrollEnabled}
          placeholderTextColor={theme.icon.muted}
          style={[
            styles.input,
            inputStyleProp ?? {},
            multiline
              ? {
                  flex: 1,
                  alignSelf: 'stretch',
                  width: '100%',
                  minHeight: multilineMinHeight - 16,
                  maxHeight: undefined,
                  textAlignVertical: 'top',
                  paddingVertical: 10,
                  ...(Platform.OS === 'android'
                    ? { includeFontPadding: false }
                    : null),
                }
              : Platform.OS === 'android'
                ? {
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                  }
                : {
                    paddingVertical: 12,
                  },
          ]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {endElement && <View style={styles.endElement}>{endElement}</View>}
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    ...formStyles(theme),
    field: {
      width: '100%',
    },
    startElement: {
      marginRight: 12,
    },
    endElement: {
      marginLeft: 12,
    },
    inputWrapperMultiline: {
      alignItems: 'flex-start',
      maxHeight: undefined,
      paddingVertical: 8,
    },
  });
