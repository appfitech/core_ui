import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AvatarSvg from '@/assets/images/avatar.svg';
import { ROUTES } from '@/constants/routes';
import { PROFILE_LIST_ITEMS } from '@/constants/screens';
import { textStyles } from '@/constants/typography';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';

export default function ProfileScreen() {
  const { theme } = useTheme();

  const router = useRouter();
  const person = useUserStore((s) => s.user?.user?.person);
  const user = useUserStore((s) => s.user?.user);

  const userType = useUserStore((s) => s.user?.user?.type);
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const styles = getStyles(theme);

  const handleLogout = async () => {
    await useUserStore.getState().logout();
    router.replace('/');
  };

  const handleSubscriptionClick = async () => {
    router.push(ROUTES.subscription);
  };

  const userAvatarURL = getUserAvatarURL(person);

  return (
    <PageContainer hasBackButton={false} contentPaddingBottom={120}>
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
              { backgroundColor: theme.backgroundInput },
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
            textColor={theme.successText}
            backgroundColor={theme.successBackground}
          />
          {user?.premium && !isTrainer && (
            <TouchableOpacity onPress={handleSubscriptionClick}>
              <Tag
                icon="cash-outline"
                label={`Premium ${user?.premiumBy === 'CONTRACT' ? '(Con Contrato)' : '(Por Pago)'}`}
                textColor={theme.warningText}
                backgroundColor={theme.warningBackground}
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

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      ...textStyles(theme).title,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    email: {
      ...textStyles(theme).subtitle,
      marginTop: 4,
      color: theme.textSecondary,
    },
    tagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      columnGap: 8,
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 4,
      paddingHorizontal: 4,
      overflow: 'hidden',
    },
    logoutButton: {
      marginTop: 24,
    },
  });
