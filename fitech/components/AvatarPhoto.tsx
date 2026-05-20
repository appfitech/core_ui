import { useEffect, useState } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

const DEFAULT_SIZE = 80;

/** Empty avatar artwork has inset padding; zoom so it fills the circle like a real photo. */
const PLACEHOLDER_SCALE = 1.32;

const EMPTY_AVATAR = {
  female: require('@/assets/images/avatars/empty_avatar_female.jpg'),
  male: require('@/assets/images/avatars/empty_avatar_male.jpg'),
} as const;

export type AvatarGender = 'M' | 'F' | 'OTHER' | string | null | undefined;

type Props = {
  url?: string | null;
  gender?: AvatarGender;
  /** Width and height in px. @default 80 */
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

function resolveEmptyAvatarSource(gender?: AvatarGender) {
  return gender === 'F' ? EMPTY_AVATAR.female : EMPTY_AVATAR.male;
}

export function AvatarPhoto({
  url,
  gender,
  size = DEFAULT_SIZE,
  style,
  containerStyle,
}: Props) {
  const { theme } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const trimmedUrl = url?.trim() ?? '';
  const showRemote = Boolean(trimmedUrl) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [trimmedUrl]);

  const radius = size / 2;
  const isPlaceholder = !showRemote;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: isPlaceholder
            ? theme.background.input
            : theme.background.card,
        },
        containerStyle,
      ]}
    >
      <Image
        source={
          showRemote ? { uri: trimmedUrl } : resolveEmptyAvatarSource(gender)
        }
        style={[styles.image, isPlaceholder && styles.placeholderImage, style]}
        resizeMode="cover"
        onError={() => setImageFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    transform: [{ scale: PLACEHOLDER_SCALE }],
  },
});
