import { Image, StyleSheet, View } from 'react-native';

import AvatarSvg from '@/assets/images/avatar.svg';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Props = {
  url: string | undefined;
};

export function AvatarPhoto({ url = '' }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return url ? (
    <Image
      source={{
        uri: url,
      }}
      style={styles.avatar}
    />
  ) : (
    <View style={styles.avatarWrapper}>
      <AvatarSvg width="100%" height="100%" />
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
    },
    avatarWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
      backgroundColor: theme.dark100,
    },
  });
