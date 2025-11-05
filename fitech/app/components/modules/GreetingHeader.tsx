import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { getRandomMotivationalQuote } from '@/constants/quotes';
import { ROUTES } from '@/constants/routes';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

import { AppText } from '../AppText';
import { SearchBar } from '../SearchBar';
import { SupportButton } from '../SupportButton';

export function GreetingHeader() {
  // Hooks
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  // User Store
  const user = useUserStore((s) => s.user);
  const userAvatarURL = getUserAvatarURL(user?.user?.person);
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <View style={styles.avatarRow}>
          {userAvatarURL && (
            <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
          )}
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => router.push(ROUTES.profile)}
          >
            <AppText style={styles.greeting}>
              {`Hola ${user?.user?.person?.firstName}`}
            </AppText>
            <AppText style={styles.subtext}>
              {getRandomMotivationalQuote()}
            </AppText>
          </TouchableOpacity>
        </View>
        <SupportButton />
      </View>

      <TouchableOpacity
        style={{
          paddingHorizontal: 16,
          flexDirection: 'row',

          columnGap: 4,
          alignItems: 'center',
        }}
        onPress={() => router.push(ROUTES.trainers)}
      >
        <SearchBar
          placeholder={isTrainer ? 'Buscar clientes…' : 'Buscar trainers…'}
          readOnly
          onPress={() => router.push(ROUTES.trainers)}
        />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    headerWrapper: {
      paddingTop: 16,
      paddingBottom: 24,
      rowGap: 16,
      backgroundColor: theme.backgroundInverted,
    },
    headerRow: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      flex: 1,
      paddingVertical: 8,
    },
    greeting: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
      color: theme.dark100,
      textAlign: 'left',
    },
    subtext: {
      ...HEADING_STYLES(theme).subtitle,
      textAlign: 'left',
      color: theme.dark300,
      flexShrink: 1,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 70,
    },
    textContainer: {
      flex: 1,
      rowGap: 4,
    },
  });
