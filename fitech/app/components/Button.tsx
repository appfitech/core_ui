import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  type = 'primary',
  style = {},
}: Props) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={ZoomIn.delay(200)}>
      <TouchableOpacity
        style={[
          SHARED_STYLES(theme).submitButton,
          STYLES_MAP(theme)[type] ?? {},
          style,
        ]}
        onPress={onPress}
      >
        <AppText
          style={[
            SHARED_STYLES(theme).submitText,
            STYLES_MAP(theme)[type] ?? {},
            { borderWidth: 0 },
          ]}
        >
          {label}
        </AppText>
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
});
