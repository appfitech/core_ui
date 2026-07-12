import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import {
  CHAT_COMPOSER_RESERVE,
  ChatMessageComposer,
} from '@/components/chat/ChatMessageComposer';
import PageContainer from '@/components/PageContainer';
import { ROUTES } from '@/constants/routes';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useChatWebSocket } from '@/contexts/ChatWebSocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSmartBack } from '@/hooks/use-smart-back';
import {
  useGetChat,
  useGetChatMessages,
} from '@/lib/api/queries/use-chat-queries';
import { queryKeys } from '@/lib/api/query-keys';
import { useUserStore } from '@/stores/user';
import { MessageDto } from '@/types/api/types.gen';
import { AppTheme } from '@/types/theme';
import { formatTimeLocal, parseServerDateTime } from '@/utils/dates';

const CONTRACT_LOGO = require('../../../assets/images/logos/rounded_logo.webp');
const CONNECTING_OVERLAY_DELAY_MS = 1000;

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
  createdAt?: string;
  senderId?: number;
};

function getMessageSenderId(m: MessageDto): number | undefined {
  const raw = m as MessageDto & { senderId?: number };
  return raw.sender?.id ?? raw.senderId;
}

function mapMessageFromApi(m: MessageDto, currentUserId: number): Message {
  const id = m.id != null ? String(m.id) : Math.random().toString(36).slice(2);
  const senderId = getMessageSenderId(m);
  const isMine = senderId != null ? senderId === currentUserId : false;

  return {
    id,
    from: isMine ? 'me' : 'them',
    senderId,
    text: m.messageContent ?? '',
    time: formatTimeLocal(m.createdAt),
    createdAt: m.createdAt,
  };
}

function mergeWsWithExisting(existing: Message, incoming: Message): Message {
  if (existing.senderId != null && incoming.senderId == null) {
    return {
      ...incoming,
      senderId: existing.senderId,
      from: existing.from,
    };
  }

  if (
    existing.from === 'me' &&
    incoming.from === 'them' &&
    incoming.senderId == null
  ) {
    return {
      ...incoming,
      from: 'me',
      senderId: existing.senderId,
    };
  }

  return incoming;
}

function getMessageSortKey(message: Message): number {
  if (message.createdAt) {
    const parsed = parseServerDateTime(message.createdAt);
    if (parsed) return parsed.getTime();
  }

  if (message.id.startsWith('pending-')) {
    const pendingTs = Number(message.id.slice('pending-'.length));
    if (!Number.isNaN(pendingTs)) return pendingTs;
  }

  const numericId = Number(message.id);
  if (!Number.isNaN(numericId)) return numericId;

  return Number.MAX_SAFE_INTEGER;
}

function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const ta = getMessageSortKey(a);
    const tb = getMessageSortKey(b);
    if (ta !== tb) return ta - tb;
    return a.id.localeCompare(b.id);
  });
}

export default function ChatDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const styles = getStyles(theme);
  const { chatsScreen: chatCopy, common } = TRANSLATIONS;
  const handleBack = useSmartBack({ authenticatedFallback: ROUTES.chats });

  const invalidateChatList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.chats.unreadCount,
    });
  }, [queryClient]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.chats.unreadCount,
        });
      };
    }, [queryClient]),
  );

  const currentUserId = useUserStore((s) => s.getUserId());
  const isTrainer = useUserStore((s) => s.getIsTrainer());
  const {
    sendMessage: sendChatMessage,
    subscribe: subscribeChatMessages,
    isConnected,
  } = useChatWebSocket();

  const conversationId = id;
  const conversationIdNumber = Number(id);

  const { data: chatData } = useGetChat(conversationId);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatMessages(conversationId);

  const [wsMessages, setWsMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showConnectingOverlay, setShowConnectingOverlay] = useState(false);

  const messagesScrollRef = useRef<ScrollView | null>(null);

  const scrollMessagesToEnd = useCallback((animated = true) => {
    messagesScrollRef.current?.scrollToEnd({ animated });
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      scrollMessagesToEnd(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollMessagesToEnd]);

  const restMessages: Message[] = useMemo(() => {
    if (currentUserId == null) return [];
    const backendMessages: MessageDto[] = messagesData?.data ?? [];
    return backendMessages.map((m) => mapMessageFromApi(m, currentUserId));
  }, [messagesData, currentUserId]);

  const mergedMessages: Message[] = useMemo(() => {
    const byId = new Map<string, Message>();
    for (const m of restMessages) byId.set(m.id, m);
    for (const m of wsMessages) {
      const existing = byId.get(m.id);
      byId.set(m.id, existing ? mergeWsWithExisting(existing, m) : m);
    }
    return sortMessages(Array.from(byId.values()));
  }, [restMessages, wsMessages]);

  useEffect(() => {
    if (mergedMessages.length > 0) {
      scrollMessagesToEnd(false);
    }
  }, [mergedMessages.length, scrollMessagesToEnd]);

  const hasError =
    !!messagesError || (messagesData && messagesData.success === false);

  useEffect(() => {
    if (isConnected) {
      setShowConnectingOverlay(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowConnectingOverlay(true);
    }, CONNECTING_OVERLAY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isConnected]);

  useEffect(() => {
    if (
      !Number.isFinite(conversationIdNumber) ||
      conversationIdNumber <= 0 ||
      currentUserId == null
    ) {
      return;
    }

    return subscribeChatMessages((msgFromApi) => {
      if (msgFromApi.conversationId !== conversationIdNumber) return;

      const mapped = mapMessageFromApi(msgFromApi, currentUserId);

      setWsMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev;

        const pendingMatch = prev.find(
          (m) =>
            m.id.startsWith('pending-') &&
            m.from === 'me' &&
            m.text === mapped.text,
        );

        const withoutPendingEcho = pendingMatch
          ? prev.filter((m) => m.id !== pendingMatch.id)
          : prev;

        const messageToAdd = pendingMatch
          ? {
              ...mapped,
              from: 'me' as const,
              senderId: currentUserId ?? mapped.senderId,
              createdAt: pendingMatch.createdAt ?? mapped.createdAt,
              time: pendingMatch.time ?? mapped.time,
            }
          : mapped;

        return [...withoutPendingEcho, messageToAdd];
      });
      invalidateChatList();
    });
  }, [
    conversationIdNumber,
    currentUserId,
    invalidateChatList,
    subscribeChatMessages,
  ]);

  const composerOffset = useMemo(() => {
    if (keyboardHeight > 0) return keyboardHeight;
    return 0;
  }, [keyboardHeight]);

  const composerSafePadding = useMemo(() => {
    if (keyboardHeight > 0) return 8;
    return Math.max(insets.bottom, 12);
  }, [insets.bottom, keyboardHeight]);

  const messagesBottomPadding = useMemo(
    () => CHAT_COMPOSER_RESERVE + composerOffset + composerSafePadding + 8,
    [composerOffset, composerSafePadding],
  );

  const handleSend = useCallback(() => {
    if (!isConnected) return;

    const text = input.trim();
    if (
      !text ||
      !Number.isFinite(conversationIdNumber) ||
      conversationIdNumber <= 0
    ) {
      return;
    }

    if (currentUserId == null) {
      showAlert({
        title: common.errorTitle,
        message: chatCopy.sendNotConnectedMessage,
        buttons: [{ text: common.understood }],
      });
      return;
    }

    const pendingId = `pending-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const optimisticMessage: Message = {
      id: pendingId,
      from: 'me',
      text,
      time: formatTimeLocal(nowIso),
      createdAt: nowIso,
      senderId: currentUserId ?? undefined,
    };

    setWsMessages((prev) => [...prev, optimisticMessage]);
    setInput('');

    const sent = sendChatMessage({
      conversationId: conversationIdNumber,
      messageContent: text,
    });

    if (sent) {
      invalidateChatList();
    } else {
      setWsMessages((prev) => prev.filter((m) => m.id !== pendingId));
      showAlert({
        title: chatCopy.sendNotConnectedTitle,
        message: chatCopy.sendNotConnectedMessage,
        buttons: [{ text: common.understood }],
      });
    }
  }, [
    chatCopy.sendNotConnectedMessage,
    chatCopy.sendNotConnectedTitle,
    common.errorTitle,
    common.understood,
    conversationIdNumber,
    currentUserId,
    input,
    invalidateChatList,
    isConnected,
    sendChatMessage,
    showAlert,
  ]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleInputFocus = useCallback(() => {
    scrollMessagesToEnd(true);
  }, [scrollMessagesToEnd]);

  const handleMessagesContentSizeChange = useCallback(() => {
    scrollMessagesToEnd(false);
  }, [scrollMessagesToEnd]);

  const headerTitle =
    title ??
    chatData?.data?.otherUserName ??
    chatData?.data?.otherUserUsername ??
    'Chat';

  const isContractConversation = chatData?.data?.matchType === 'CONTRACT';
  const { chatContractBanner } = TRANSLATIONS;

  return (
    <PageContainer
      title={headerTitle}
      style={styles.pageStyle}
      disableScroll
      includeTabBarPadding={false}
      hasBottomPadding={false}
      onBackPress={handleBack}
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

      <View style={styles.chatBody}>
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
              style={styles.messagesScroll}
              contentContainerStyle={[
                styles.messagesContent,
                { paddingBottom: messagesBottomPadding },
              ]}
              onContentSizeChange={handleMessagesContentSizeChange}
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

        <View
          style={[
            styles.composerDock,
            {
              bottom: composerOffset,
              paddingBottom: composerSafePadding,
            },
          ]}
        >
          <ChatMessageComposer
            value={input}
            onChangeText={handleInputChange}
            onSend={handleSend}
            onFocus={handleInputFocus}
            disabled={!isConnected}
          />
        </View>

        {!isConnected && showConnectingOverlay ? (
          <View style={styles.connectingOverlay} pointerEvents="auto">
            <View style={styles.connectingCard}>
              <ActivityIndicator color={theme.brand.primary} size="small" />
              <AppText style={styles.connectingTitle}>
                {chatCopy.connectingTitle}
              </AppText>
              <AppText style={styles.connectingMessage}>
                {chatCopy.connectingMessage}
              </AppText>
            </View>
          </View>
        ) : null}
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
    chatBody: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
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
    messagesScroll: {
      flex: 1,
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
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 2,
      backgroundColor: theme.background.app,
    },
    connectingOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      paddingHorizontal: 24,
    },
    connectingCard: {
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
      rowGap: 10,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 16,
      backgroundColor: theme.background.card,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    connectingTitle: {
      ...text.leadSemibold,
      color: theme.text.primary,
      textAlign: 'center',
    },
    connectingMessage: {
      ...text.small,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};
