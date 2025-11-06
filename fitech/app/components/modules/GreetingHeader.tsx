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
import { ChatButton } from '../ChatButton';
import { NotificationsButton } from '../NotificationsButton';
import { SearchBar } from '../SearchBar';
import { SupportButton } from '../SupportButton';

export function GreetingHeader() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const user = useUserStore((s) => s.user);
  const userAvatarURL = getUserAvatarURL(user?.user?.person);
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View style={styles.avatarRow}>
          {userAvatarURL && (
            <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
          )}
          <TouchableOpacity onPress={() => router.push(ROUTES.profile)}>
            <AppText style={styles.greeting}>
              {`Hola ${user?.user?.person?.firstName}!`}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <ChatButton />
          <NotificationsButton />
          <SupportButton />
        </View>
      </View>

      {/* Quote */}
      <AppText style={styles.subtext}>{getRandomMotivationalQuote()}</AppText>

      {/* Search */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity onPress={() => router.push(ROUTES.trainers)}>
          <SearchBar
            placeholder={isTrainer ? 'Buscar clientes…' : 'Buscar trainers…'}
            readOnly
            onPress={() => router.push(ROUTES.trainers)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    headerWrapper: {
      paddingTop: 16,
      paddingBottom: 24,
      paddingHorizontal: 16,
      rowGap: 4,
      backgroundColor: theme.backgroundInverted,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      flexShrink: 1,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
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
      paddingRight: 70,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 70,
    },
  });
