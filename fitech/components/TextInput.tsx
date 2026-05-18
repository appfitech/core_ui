import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { formStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';
import { Tag } from './Tag';

type Props = TextInputProps & {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  label?: string;
  required?: boolean;
  /** Use on sign-up password fields so iOS offers a strong password once (not on confirm). */
  newPasswordAutofill?: boolean;
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
    secureTextEntry,
    style: inputStyleProp,
    ...rest
  } = props;

  const secureAutofillProps = resolveSecureTextProps(
    secureTextEntry,
    newPasswordAutofill,
    props,
  );

  const minHeight = props.multiline
    ? (props.numberOfLines ?? 1) * 16 + 16 * 2
    : 52;

  return (
    <View key={props.id ?? 'text-input'}>
      {label && (
        <View style={styles.labelContainer}>
          <AppText style={styles.label}>{label}</AppText>
          {!required && (
            <Tag
              backgroundColor={theme.warningBackground}
              textColor={theme.warningText}
              style={styles.optionalTag}
              label="Opcional"
            />
          )}
        </View>
      )}
      <View style={styles.inputWrapper}>
        {startElement && (
          <View style={styles.startElement}>{startElement}</View>
        )}
        <NativeTextInput
          {...rest}
          {...secureAutofillProps}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={theme.dark700}
          style={[
            styles.input,
            { flex: 1 },
            inputStyleProp ?? {},
            props.multiline && {
              height: undefined,
              minHeight,
              textAlignVertical: 'top',
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
    startElement: {
      marginRight: 12,
    },
    endElement: {
      marginLeft: 12,
    },
  });
