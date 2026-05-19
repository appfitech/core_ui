import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import PageContainer from '@/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import {
  useGetChat,
  useGetChatMessages,
} from '@/lib/api/queries/use-chat-queries';
import { useUserStore } from '@/stores/user';
import { MessageDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

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
  const styles = getStyles(theme, insets.bottom);

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
        if (__DEV__) {
          console.log('[K] event', event);
        }
        try {
          const msgFromApi: MessageDto = JSON.parse(event.data);
          if (__DEV__) {
            console.log('[K] msgFromApi', msgFromApi);
          }

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
        if (__DEV__) {
          console.log('[K] event.code', event.code);
        }
        wsRef.current = null;
        if (__DEV__) {
          console.log('Chat WebSocket closed', event.code, event.reason);
        }

        if (isUnmounted) return;

        if (event.code === 1008) {
          console.warn('Invalid token for chat WebSocket (1008)');
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (event) => {
        if (__DEV__) {
          console.log('[K] error', JSON.stringify(event));
        }
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

  return (
    <PageContainer
      title={headerTitle}
      style={styles.pageStyle}
      hasBottomPadding={false}
    >
      {isContractConversation && (
        <View style={styles.contractBanner}>
          <Image
            source={CONTRACT_LOGO}
            style={styles.contractBannerLogo}
            resizeMode="contain"
          />
          <AppText style={styles.contractBannerText}>
            {isTrainer
              ? 'Conversación por contrato — Estás chateando con tu cliente'
              : 'Conversación por contrato — Estás chateando con tu entrenador'}
          </AppText>
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
            onContentSizeChange={() =>
              messagesScrollRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
          >
            {mergedMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.from === 'me'
                    ? styles.messageRowMe
                    : styles.messageRowThem,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <AppText
                    style={
                      msg.from === 'me'
                        ? styles.bubbleMeText
                        : styles.bubbleText
                    }
                  >
                    {msg.text}
                  </AppText>
                  <AppText style={styles.bubbleTime}>{msg.time}</AppText>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={theme.text.secondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color={theme.background.app} />
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme, safeBottom: number) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      paddingBottom: 0,
      paddingHorizontal: 16,
      rowGap: 16,
    },
    contractBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.background.card ?? theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
    },
    contractBannerLogo: {
      width: 32,
      height: 32,
    },
    contractBannerText: {
      flex: 1,
      ...text.nav,
      color: theme.text.secondary,
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
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    bubbleMe: {
      backgroundColor: theme.text.primary,
      borderBottomRightRadius: 6,
      shadowColor: theme.text.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    bubbleThem: {
      backgroundColor: theme.background.input,
      borderWidth: 1,
      borderColor: theme.border.default,
      borderBottomLeftRadius: 6,
      shadowColor: theme.text.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    bubbleText: {
      color: theme.text.primary,
      ...text.link,
      lineHeight: 22,
    },
    bubbleMeText: {
      color: theme.background.app,
      ...text.link,
      lineHeight: 22,
    },
    bubbleTime: {
      marginTop: 6,
      ...text.caption,
      color: theme.text.secondary,
      textAlign: 'right',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      columnGap: 10,
      paddingTop: 12,
      paddingBottom: Math.max(safeBottom, 20),
      paddingHorizontal: 0,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.background.app,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.default,
      ...text.small,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.text.primary,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });
};
