import {
  StyleSheet,
  TextInput as NativeTextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { formStyles } from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = TextInputProps & {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  label?: string;
};

export function TextInput(props: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    startElement = null,
    endElement = null,
    label = null,
    ...rest
  } = props;

  const minHeight = props.multiline
    ? (props.numberOfLines ?? 1) * 16 + 16 * 2
    : 52;

  return (
    <View key={props.id ?? 'text-input'}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={styles.inputWrapper}>
        {startElement && (
          <View style={styles.startElement}>{startElement}</View>
        )}
        <NativeTextInput
          {...rest}
          placeholderTextColor={theme.dark700}
          style={[
            styles.input,
            { flex: 1 },
            props.style ?? {},
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
