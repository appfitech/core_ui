import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { AvatarPhoto } from '@/components/AvatarPhoto';
import { ListItem } from '@/components/ListItem';
import PageContainer from '@/components/PageContainer';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/constants/routes';
import { PROFILE_MENU_SECTIONS } from '@/constants/screens';
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
      <View style={styles.header}>
        <AvatarPhoto
          url={userAvatarURL}
          gender={person?.gender}
          size={88}
          containerStyle={styles.avatar}
        />
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
                icon="star"
                label={`Premium ${user?.premiumBy === 'CONTRACT' ? '(Con Contrato)' : '(Por Pago)'}`}
                textColor={theme.status.warning.text}
                backgroundColor={theme.status.warning.bg}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.sectionsContainer}>
        {PROFILE_MENU_SECTIONS.map((section, index) => {
          const { title, items } = section;

          return (
            <View key={`${title}-${index}`}>
              <AppText style={styles.smallMedium}>{title}</AppText>
              <View>
                {items.map((item, index) => {
                  const { type, userOnly, premiumOnly } = item;
                  const isLogout = type === 'logout';

                  const handleItemClick = isLogout ? handleLogout : null;

                  if (userOnly && isTrainer) {
                    return null;
                  }

                  if (premiumOnly && !user?.premium) {
                    return null;
                  }

                  return (
                    <ListItem
                      key={`${item.label}-${index}`}
                      {...item}
                      onClick={handleItemClick}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    ...text,
    header: {
      alignItems: 'center',
      marginBottom: 24,
      marginTop: 8,
    },
    avatar: {
      marginBottom: 12,
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
    logoutButton: {
      marginTop: 24,
    },
    sectionsContainer: {
      rowGap: 24,
    },
  });
};
