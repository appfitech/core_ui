import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ChatButton } from '@/components/ChatButton';
import { NotificationsButton } from '@/components/NotificationsButton';
import { SupportButton } from '@/components/SupportButton';
import { getRandomMotivationalQuote } from '@/constants/quotes';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

export function GreetingHeader() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const user = useUserStore((s) => s.user);
  const userAvatarURL = getUserAvatarURL(user?.user?.person);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View style={styles.avatarRow}>
          {userAvatarURL && (
            <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
          )}
          <TouchableOpacity onPress={() => router.push(ROUTES.profile)}>
            <AppText variant="greeting" style={styles.greeting}>
              {`Hola ${user?.user?.person?.firstName ?? 'Usuario'}`}
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
      <AppText variant="subtitle" style={styles.subtext}>
        {getRandomMotivationalQuote()}
      </AppText>
    </View>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    headerWrapper: {
      paddingTop: 12,
      paddingBottom: 20,
      paddingHorizontal: 16,
      rowGap: 4,
      backgroundColor: theme.background.card,
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
      columnGap: 10,
    },
    greeting: {
      color: theme.text.primary,
      textAlign: 'left',
    },
    subtext: {
      textAlign: 'left',
      flexShrink: 1,
      paddingRight: 100,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 70,
    },
  });
