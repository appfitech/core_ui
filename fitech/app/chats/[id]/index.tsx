import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useGetChat,
  useGetChatMessages,
} from '@/app/api/queries/use-chat-queries';
import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserStore } from '@/stores/user';
import { MessageDto } from '@/types/api/types.gen';
import { FullTheme } from '@/types/theme';

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'wss://appfitech.com/api';

function buildWsUrl(token: string) {
  const base = WS_BASE_URL.endsWith('/')
    ? WS_BASE_URL.slice(0, -1)
    : WS_BASE_URL;

  const url = `${base}/ws-native?token=${encodeURIComponent(token)}`;
  console.log('[K] ws url', url);
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
  const styles = getStyles(theme);

  const token = useUserStore((s) => s.getToken());
  const currentUserId = useUserStore((s) => s.user?.user?.id ?? 0);

  const conversationId = id;
  const conversationIdNumber = Number(id);

  const { data: chatData } = useGetChat(conversationId);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetChatMessages(conversationId);

  const [wsMessages, setWsMessages] = useState<Message[]>([]);
  const [wsStatus, setWsStatus] = useState<
    'connecting' | 'open' | 'closed' | 'error'
  >('connecting');

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
    if (!conversationIdNumber || !token || !currentUserId) {
      return;
    }

    let isUnmounted = false;

    const connect = () => {
      const url = buildWsUrl(token);
      const ws = new WebSocket(url);

      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('open');
        console.log('[K] hellllllloooo');
        console.log('Chat WebSocket connected');
      };

      ws.onmessage = (event) => {
        console.log('[K] event', event);
        try {
          const msgFromApi: MessageDto = JSON.parse(event.data);
          console.log('[K] msgFromApi', msgFromApi);

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
        setWsStatus('closed');
        console.log('[K] event.code', event.code);
        wsRef.current = null;
        console.log('Chat WebSocket closed', event.code, event.reason);

        if (isUnmounted) return;

        if (event.code === 1008) {
          console.warn('Invalid token for chat WebSocket (1008)');
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (event) => {
        setWsStatus('error');
        console.log('[K] error', JSON.stringify(event));
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

  return (
    <PageContainer
      header={headerTitle}
      style={{
        flex: 1,
        paddingBottom: 0,
        paddingHorizontal: 16,
        rowGap: 16,
      }}
      hasBottomPadding={false}
    >
      <AppText style={{ fontSize: 14, color: 'red' }}>
        WS status: {wsStatus}
      </AppText>

      <View style={styles.messagesContainer}>
        {isMessagesLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.backgroundInverted} />
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

      <View
        style={[styles.inputRow, Platform.OS === 'ios' && { marginBottom: 12 }]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={theme.dark400}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, !input.trim() && { opacity: 0.5 }]}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color={theme.dark100} />
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
      fontSize: 13,
      color: theme.dark400,
      textAlign: 'center',
    },
    messageRow: {
      flexDirection: 'row',
      marginVertical: 2,
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
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bubbleMe: {
      backgroundColor: theme.backgroundInverted,
      borderBottomRightRadius: 4,
    },
    bubbleThem: {
      backgroundColor: theme.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.dark300,
      borderBottomLeftRadius: 4,
    },
    bubbleText: {
      color: theme.dark900,
      fontSize: 14,
    },
    bubbleMeText: {
      color: theme.dark100,
      fontSize: 14,
    },
    bubbleTime: {
      marginTop: 4,
      fontSize: 11,
      color: theme.dark400,
      textAlign: 'right',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      columnGap: 8,
      paddingVertical: 8,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.dark300,
      fontSize: 14,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundInverted,
    },
  });
