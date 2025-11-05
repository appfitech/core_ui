import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  label?: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'destructive' | 'tertiary' | 'link';
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function Button({
  label = '',
  children = null,
  onPress,
  type = 'primary',
  style = {},
  buttonStyle = {},
  disabled = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={ZoomIn.delay(200)} style={style}>
      <TouchableOpacity
        style={[
          SHARED_STYLES(theme).submitButton,
          STYLES_MAP(theme)[type] ?? {},
          buttonStyle,
        ]}
        disabled={disabled}
        onPress={onPress}
      >
        {label && (
          <AppText
            style={[
              SHARED_STYLES(theme).submitText,
              STYLES_MAP(theme)[type] ?? {},
              { borderWidth: 0 },
            ]}
          >
            {label}
          </AppText>
        )}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const STYLES_MAP = (theme: FullTheme) => ({
  primary: {},
  secondary: {
    borderColor: theme.green700,
    borderWidth: 2,
    color: theme.green700,
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: theme.errorText,
    color: theme.errorBackground,
  },
  tertiary: {
    backgroundColor: theme.dark600,
    color: theme.dark200,
  },
  link: {
    backgroundColor: 'transparent',
    textDecorationStyle: 'solid',
    paddingVertical: 4,
    color: theme.primary,
    textDecorationLine: 'underline',
  },
});
