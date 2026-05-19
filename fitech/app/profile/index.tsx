import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AvatarSvg from '@/assets/images/avatar.svg';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { PROFILE_LIST_ITEMS } from '@/constants/screens';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { clearAppQueryCache } from '@/lib/api/mutation-cache';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

export default function ProfileScreen() {
  const { theme } = useTheme();

  const router = useRouter();
  const person = useUserStore((s) => s.user?.user?.person);
  const user = useUserStore((s) => s.user?.user);

  const userType = useUserStore((s) => s.user?.user?.type);
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const queryClient = useQueryClient();
  const styles = getStyles(theme);

  const handleLogout = async () => {
    clearAppQueryCache(queryClient);
    await useUserStore.getState().logout();
    router.replace('/');
  };

  const handleSubscriptionClick = async () => {
    router.push(ROUTES.subscription);
  };

  const userAvatarURL = getUserAvatarURL(person);

  return (
    <PageContainer hasBackButton={false}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        {userAvatarURL ? (
          <Image
            source={{
              uri: userAvatarURL,
            }}
            style={styles.avatar}
          />
        ) : (
          <View
            style={[
              styles.avatarWrapper,
              { backgroundColor: theme.background.input },
            ]}
          >
            <AvatarSvg width="100%" height="100%" />
          </View>
        )}
        <AppText style={styles.name}>
          {`${person?.firstName ?? ''} ${person?.lastName ?? ''}`}
        </AppText>
        <AppText style={styles.email}>{person?.email}</AppText>
        <View style={styles.tagsRow}>
          <Tag
            icon="person-outline"
            label={userType === 1 ? 'Trainer' : 'Usuario'}
            textColor={theme.status.success.text}
            backgroundColor={theme.status.success.bg}
          />
          {user?.premium && !isTrainer && (
            <TouchableOpacity onPress={handleSubscriptionClick}>
              <Tag
                icon="cash-outline"
                label={`Premium ${user?.premiumBy === 'CONTRACT' ? '(Con Contrato)' : '(Por Pago)'}`}
                textColor={theme.status.warning.text}
                backgroundColor={theme.status.warning.bg}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        style={styles.section}
      >
        {PROFILE_LIST_ITEMS.map((item) => {
          if (item?.userOnly && isTrainer) {
            return null;
          }

          if (item?.premiumOnly && !user?.premium) {
            return null;
          }

          return <ListItem key={item.route} {...item} />;
        })}
      </Animated.View>

      <Button
        label="Cerrar sesión"
        style={styles.logoutButton}
        onPress={handleLogout}
        type="destructive"
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    header: {
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 8,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      marginBottom: 12,
    },
    avatarWrapper: {
      width: 88,
      height: 88,
      borderRadius: 44,
      overflow: 'hidden',
    },
    name: {
      ...text.title,
      color: theme.text.primary,
    },
    email: {
      ...text.subtitle,
      marginTop: 4,
      color: theme.text.secondary,
    },
    tagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      columnGap: 8,
    },
    section: {
      backgroundColor: theme.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.default,
      paddingVertical: 4,
      paddingHorizontal: 4,
      overflow: 'hidden',
    },
    logoutButton: {
      marginTop: 24,
    },
  });
};
