import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Button } from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { TRANSLATIONS } from '@/constants/strings';
import { textStyles } from '@/constants/styles';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetChat,
  useGetChatMessages,
} from '@/lib/api/queries/use-chat-queries';
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

const WS_BASE_URL = 'ws://appfitech.com/api';

function buildWsUrl(token: string) {
  const base = WS_BASE_URL.endsWith('/')
    ? WS_BASE_URL.slice(0, -1)
    : WS_BASE_URL;

  const url = `${base}/ws-native?token=${encodeURIComponent(token)}`;

  return url;
}

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
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);

  const token = useUserStore((s) => s.getToken());
  const currentUserId = useUserStore((s) => s.user?.user?.id ?? 0);
  const isTrainer = useUserStore((s) => s.getIsTrainer());

  const conversationId = id;
  const conversationIdNumber = Number(id);

  const { data: chatData } = useGetChat(conversationId);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatMessages(conversationId);

  const [wsMessages, setWsMessages] = useState<Message[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const messagesScrollRef = useRef<ScrollView | null>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const scrollMessagesToEnd = (animated = true) => {
    messagesScrollRef.current?.scrollToEnd({ animated });
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardInset(event.endCoordinates.height);
      scrollMessagesToEnd(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardInset(0));

    return () => {
      showSub.remove();
      hideSub.remove();
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

  const hasError =
    !!messagesError || (messagesData && messagesData.success === false);

  /** websocket */
  useEffect(() => {
    if (__DEV__) {
      console.log('[WebSocket] Effect triggered with:', {
        conversationId: conversationIdNumber,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        userId: currentUserId,
      });
    }

    if (!conversationIdNumber || !token || !currentUserId) {
      if (__DEV__) {
        console.log('[WebSocket] ❌ Missing requirements - not connecting');
      }
      return;
    }

    let isUnmounted = false;

    const connect = () => {
      const url = buildWsUrl(token);
      if (__DEV__) {
        console.log('[WebSocket] 🔌 Attempting connection to:', url);
      }
      const ws = new WebSocket(url);

      wsRef.current = ws;

      ws.onopen = () => {
        if (__DEV__) {
          console.log('Chat WebSocket connected');
        }
      };

      ws.onmessage = (event) => {
        try {
          const msgFromApi: MessageDto = JSON.parse(event.data);

          if (msgFromApi.conversationId !== conversationIdNumber) return;

          const mapped = mapMessageFromApi(msgFromApi, currentUserId);

          setWsMessages((prev) => {
            if (prev.some((m) => m.id === mapped.id)) return prev;
            return [...prev, mapped];
          });
        } catch (error) {
          console.error('Error parsing chat WebSocket message', error);
        }
      };

      ws.onclose = (event) => {
        wsRef.current = null;

        if (isUnmounted) return;

        if (event.code === 1008) {
          console.warn('Invalid token for chat WebSocket (1008)');
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (event) => {
        console.error('Chat WebSocket error', event);
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [conversationIdNumber, token, currentUserId]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text || !conversationIdNumber) return;

    const ws = wsRef.current;
    const payload = {
      conversationId: conversationIdNumber,
      messageContent: text,
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      console.warn('Chat WebSocket not connected, message was not sent.');
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

  const composerBottomInset =
    keyboardInset > 0 ? keyboardInset + 8 : Math.max(insets.bottom, 12);

  return (
    <View style={styles.screenRoot}>
      <PageContainer
        title={headerTitle}
        style={styles.pageStyle}
        styleContainer={styles.pageContainer}
        disableScroll
        includeTabBarPadding={false}
        hasBottomPadding={false}
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
              contentContainerStyle={[
                styles.messagesContent,
                { paddingBottom: keyboardInset > 0 ? 12 : 8 },
              ]}
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

      <View
        style={[styles.composerDock, { paddingBottom: composerBottomInset }]}
      >
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
    </View>
  );
}

const getStyles = (theme: AppTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    screenRoot: {
      flex: 1,
      backgroundColor: theme.background.app,
    },
    pageContainer: {
      flex: 1,
    },
    pageStyle: {
      flex: 1,
      paddingBottom: 0,
      rowGap: 16,
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
      paddingVertical: 8,
      rowGap: 8,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border.default,
      backgroundColor: theme.background.app,
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
