import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants/routes';
import { SHARED_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';

import { SearchBar } from '../components/SearchBar';
import { SupportButton } from '../components/SupportButton';
import { useUserStore } from '../stores/user';
import { FullTheme } from '../types/theme';
import { getUserAvatarURL } from '../utils/user';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const userAvatarURL = getUserAvatarURL(user?.user?.person);

  const handleTrainersClick = useCallback(
    () => router.push(ROUTES.trainers),
    [],
  );
  const handleProfileClick = useCallback(() => router.push(ROUTES.profile), []);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 12,
            }}
          >
            {userAvatarURL && (
              <Image source={{ uri: userAvatarURL }} style={styles.avatar} />
            )}
            <TouchableOpacity onPress={handleProfileClick}>
              <Text style={styles.greeting}>
                {`Hola ${user?.user?.person?.firstName}`}
              </Text>
              <Text style={styles.subtext}>{'Buen día'}</Text>
            </TouchableOpacity>
          </View>
          <SupportButton />
        </View>

        <TouchableOpacity
          style={{ paddingHorizontal: 16 }}
          onPress={handleTrainersClick}
        >
          <SearchBar
            placeholder={'Buscar trainers…'}
            readOnly
            onPress={handleTrainersClick}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrapper}></View>
    </ScrollView>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundHeader,
    },
    headerWrapper: {
      backgroundColor: theme.backgroundHeader,
      paddingVertical: 16,
      rowGap: 16,
    },
    headerRow: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contentWrapper: {
      backgroundColor: theme.background,
      flex: 1,
      minHeight: '100%',
    },
    greeting: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.green800,
    },
    subtext: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    ...SHARED_STYLES(theme),
  });
