import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useChatWebSocket } from '@/contexts/ChatWebSocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetChat,
  useGetChatMessages,
} from '@/lib/api/queries/use-chat-queries';
import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { MessageDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';

const CONTRACT_LOGO = require('../../../assets/images/logos/rounded_logo.webp');

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

function formatTime(isoDate?: string) {
  if (!isoDate) return '';
  const date = new Date(isoDate);

  return date.toLocaleTimeString('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function mapMessageFromApi(m: MessageDto, currentUserId: number): Message {
  const id = m.id != null ? String(m.id) : Math.random().toString(36).slice(2);
  const isMine = m.sender?.id === currentUserId;

  return {
    id,
    from: isMine ? 'me' : 'them',
    text: m.messageContent ?? '',
    time: formatTime(m.createdAt),
  };
}

export default function ChatDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const styles = getStyles(theme);

  const invalidateChatList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
  }, [queryClient]);

  const currentUserId = useUserStore((s) => s.user?.user?.id ?? 0);
  const isTrainer = useUserStore((s) => s.getIsTrainer());
  const { sendMessage: sendChatMessage, subscribe: subscribeChatMessages } =
    useChatWebSocket();

  const conversationId = id;
  const conversationIdNumber = Number(id);

  const { data: chatData } = useGetChat(conversationId);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatMessages(conversationId);

  const [wsMessages, setWsMessages] = useState<Message[]>([]);

  const messagesScrollRef = useRef<ScrollView | null>(null);

  const scrollMessagesToEnd = (animated = true) => {
    messagesScrollRef.current?.scrollToEnd({ animated });
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';

    const showSub = Keyboard.addListener(showEvent, () => {
      scrollMessagesToEnd(true);
    });

    return () => {
      showSub.remove();
    };
  }, []);

  const restMessages: Message[] = useMemo(() => {
    const backendMessages: MessageDto[] = messagesData?.data ?? [];
    return backendMessages.map((m) => mapMessageFromApi(m, currentUserId));
  }, [messagesData, currentUserId]);

  const mergedMessages: Message[] = useMemo(() => {
    const byId = new Map<string, Message>();
    for (const m of restMessages) byId.set(m.id, m);
    for (const m of wsMessages) byId.set(m.id, m);
    return Array.from(byId.values());
  }, [restMessages, wsMessages]);

  useEffect(() => {
    if (mergedMessages.length > 0) {
      scrollMessagesToEnd(false);
    }
  }, [mergedMessages.length]);

  const hasError =
    !!messagesError || (messagesData && messagesData.success === false);

  useEffect(() => {
    if (!conversationIdNumber || !currentUserId) return;

    return subscribeChatMessages((msgFromApi) => {
      if (msgFromApi.conversationId !== conversationIdNumber) return;

      const mapped = mapMessageFromApi(msgFromApi, currentUserId);

      setWsMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev;
        return [...prev, mapped];
      });
      invalidateChatList();
    });
  }, [
    conversationIdNumber,
    currentUserId,
    invalidateChatList,
    subscribeChatMessages,
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text || !conversationIdNumber) return;

    const sent = sendChatMessage({
      conversationId: conversationIdNumber,
      messageContent: text,
    });

    if (sent) {
      invalidateChatList();
    } else {
      console.warn('[ChatWS] Not connected — message was not sent.');
    }

    setInput('');
  };

  const headerTitle =
    title ??
    chatData?.data?.otherUserName ??
    chatData?.data?.otherUserUsername ??
    'Chat';

  const isContractConversation = chatData?.data?.matchType === 'CONTRACT';
  const { chatContractBanner } = TRANSLATIONS;

  const composer = (
    <View style={styles.composerDock}>
      <View style={styles.inputRow}>
        <View style={styles.inputField}>
          <TextInput
            required={false}
            placeholder="Escribe un mensaje..."
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={4}
            onFocus={() => scrollMessagesToEnd(true)}
            style={styles.messageInput}
          />
        </View>
        <Button
          type="primary"
          onPress={handleSend}
          disabled={!input.trim()}
          animated={false}
          style={styles.sendButtonWrap}
          buttonStyle={styles.sendButton}
        >
          <Ionicons name="send" size={20} color={theme.button.primaryText} />
        </Button>
      </View>
    </View>
  );

  return (
    <PageContainer
      title={headerTitle}
      style={styles.pageStyle}
      disableScroll
      includeTabBarPadding={false}
      hasBottomPadding={false}
      footer={composer}
    >
      {isContractConversation && (
        <View style={styles.contractBanner}>
          <Image
            source={CONTRACT_LOGO}
            style={styles.contractBannerLogo}
            resizeMode="contain"
          />
          <View style={styles.contractBannerTextWrap}>
            <AppText style={styles.contractBannerTitle}>
              {isTrainer
                ? chatContractBanner.trainerTitle
                : chatContractBanner.clientTitle}
            </AppText>
            <AppText style={styles.contractBannerText}>
              {isTrainer
                ? chatContractBanner.trainerSubtitle
                : chatContractBanner.clientSubtitle}
            </AppText>
          </View>
        </View>
      )}

      <View style={styles.messagesContainer}>
        {isMessagesLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.text.primary} />
            <AppText style={styles.systemText}>Cargando mensajes...</AppText>
          </View>
        ) : hasError ? (
          <View style={styles.centered}>
            <AppText style={styles.systemText}>
              No se pudieron cargar los mensajes.
            </AppText>
          </View>
        ) : mergedMessages.length === 0 ? (
          <View style={styles.centered}>
            <AppText style={styles.systemText}>
              Aún no hay mensajes. ¡Envía el primero!
            </AppText>
          </View>
        ) : (
          <ScrollView
            ref={messagesScrollRef}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollMessagesToEnd(false)}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {mergedMessages.map((msg) => {
              const isMe = msg.from === 'me';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isMe ? styles.messageRowMe : styles.messageRowThem,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubbleThem,
                    ]}
                  >
                    <AppText
                      style={isMe ? styles.bubbleMeText : styles.bubbleText}
                    >
                      {msg.text}
                    </AppText>
                    <AppText
                      style={isMe ? styles.bubbleMeTime : styles.bubbleTime}
                    >
                      {msg.time}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      flex: 1,
      paddingBottom: 0,
      rowGap: 12,
    },
    contractBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.status.info.bg,
      borderWidth: 1,
      borderColor: theme.status.info.border,
    },
    contractBannerLogo: {
      width: 32,
      height: 32,
    },
    contractBannerTextWrap: {
      flex: 1,
      rowGap: 2,
    },
    contractBannerTitle: {
      ...text.smallMedium,
      color: theme.status.info.icon,
    },
    contractBannerText: {
      ...text.caption,
      color: theme.status.info.text,
    },
    messagesContainer: {
      flex: 1,
      minHeight: 0,
    },
    messagesContent: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingVertical: 8,
      rowGap: 8,
    },
    centered: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 16,
    },
    systemText: {
      marginTop: 8,
      ...text.nav,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    messageRow: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    messageRowMe: {
      justifyContent: 'flex-end',
    },
    messageRowThem: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '78%',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bubbleMe: {
      backgroundColor: theme.brand.primaryDark,
      borderBottomRightRadius: 4,
    },
    bubbleThem: {
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderBottomLeftRadius: 4,
    },
    bubbleText: {
      ...text.small,
      color: theme.text.primary,
      lineHeight: 20,
    },
    bubbleMeText: {
      ...text.small,
      lineHeight: 20,
      color: theme.text.primary,
    },
    bubbleTime: {
      marginTop: 4,
      ...text.caption,
      color: theme.text.tertiary,
      textAlign: 'right',
    },
    bubbleMeTime: {
      marginTop: 4,
      ...text.caption,
      color: 'rgba(245, 247, 245, 0.72)',
      textAlign: 'right',
    },
    composerDock: {
      width: '100%',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      columnGap: 10,
    },
    inputField: {
      flex: 1,
      minWidth: 0,
    },
    messageInput: {
      maxHeight: 96,
      minHeight: 48,
      textAlignVertical: 'top',
    },
    sendButtonWrap: {
      flexShrink: 0,
    },
    sendButton: {
      width: 48,
      height: 48,
      minHeight: 48,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 12,
    },
  });
};
