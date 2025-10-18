import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AvatarSvg from '@/assets/images/avatar.svg';
import { ROUTES } from '@/constants/routes';
import { PROFILE_LIST_ITEMS } from '@/constants/screens';
import { HEADING_STYLES } from '@/constants/shared_styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';
import { getUserAvatarURL } from '@/utils/user';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ListItem } from '../components/ListItem';
import PageContainer from '../components/PageContainer';
import { Tag } from '../components/Tag';

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
          <View style={styles.avatarWrapper}>
            <AvatarSvg width="100%" height="100%" />
          </View>
        )}
        <AppText style={styles.name}>
          {`${person?.firstName ?? ''} ${person?.lastName ?? ''}`}
        </AppText>
        <AppText style={styles.email}>{person?.email}</AppText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            columnGap: 4,
          }}
        >
          <Tag
            icon={'user'}
            label={userType === 1 ? 'Trainer' : 'Usuario'}
            textColor={theme.successText}
            backgroundColor={theme.successBackground}
          />
          {user?.premium && !isTrainer && (
            <TouchableOpacity onPress={handleSubscriptionClick}>
              <Tag
                icon={'dollar-sign'}
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
        label={'Cerrar sesión'}
        style={{ marginTop: 30 }}
        onPress={handleLogout}
        type={'destructive'}
      />
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 10,
    },
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
      backgroundColor: '#fff',
    },
    name: {
      ...HEADING_STYLES(theme).title,
      fontWeight: '700',
    },
    email: {
      ...HEADING_STYLES(theme).subtitle,
      marginTop: 4,
    },
    userType: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      shadowColor: theme.background,
      shadowOpacity: 0.9,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.dark500,
    },
    iconWrapper: {
      width: 40,
      alignItems: 'center',
    },
    itemLabel: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '500',
      color: theme.dark900,
      paddingVertical: 10,
    },
  });
