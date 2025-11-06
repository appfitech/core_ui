import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

const MOCK_CHATS = [
  {
    id: '1',
    name: 'Lucía · Trainer',
    lastMessage: 'Listo, mañana le damos a pierna 💪',
    time: 'Hoy · 7:30 a. m.',
    unread: 2,
  },
  {
    id: '2',
    name: 'Carlos · GymBro',
    lastMessage: '¿Entrenamos pecho el viernes?',
    time: 'Ayer · 8:15 p. m.',
    unread: 0,
  },
  {
    id: '3',
    name: 'Ana · Nutri',
    lastMessage: 'Te mando el nuevo plan de comidas 😉',
    time: 'Lun · 5:10 p. m.',
    unread: 1,
  },
];

export default function ChatsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <PageContainer
      header="Chats"
      subheader="Mantén el contacto con tus gymcrush y gymbros cuando lo necesites."
      style={{ flex: 1, paddingBottom: 0 }}
    >
      <View style={styles.list}>
        {MOCK_CHATS.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatRow}
            onPress={() =>
              router.push({
                pathname: '/chats/[id]',
                params: { id: chat.id },
              })
            }
          >
            <View style={styles.avatar}>
              <AppText style={styles.avatarInitials}>{chat.name[0]}</AppText>
            </View>

            <View style={styles.chatMain}>
              <AppText style={styles.chatName} numberOfLines={1}>
                {chat.name}
              </AppText>
              <AppText style={styles.chatPreview} numberOfLines={1}>
                {chat.lastMessage}
              </AppText>
            </View>

            <View style={styles.meta}>
              <AppText style={styles.chatTime}>{chat.time}</AppText>
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <AppText style={styles.unreadText}>{chat.unread}</AppText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
    list: {
      width: '100%',
      marginTop: 8,
      rowGap: 8,
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: theme.background,
      shadowColor: theme.backgroundInverted,
      shadowOpacity: 0.04,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      columnGap: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      color: theme.dark100,
      fontWeight: '700',
      fontSize: 18,
    },
    chatMain: {
      flex: 1,
      rowGap: 2,
    },
    chatName: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    chatPreview: {
      fontSize: 13,
      color: theme.dark400,
    },
    meta: {
      alignItems: 'flex-end',
      rowGap: 6,
      marginLeft: 8,
    },
    chatTime: {
      fontSize: 11,
      color: theme.dark400,
    },
    unreadBadge: {
      minWidth: 20,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.backgroundInverted,
      alignItems: 'center',
    },
    unreadText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.dark100,
    },
  });
