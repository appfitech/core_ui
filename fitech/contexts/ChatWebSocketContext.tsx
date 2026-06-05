import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { buildChatWsUrl } from '@/lib/api/chat-ws';
import { refreshAccessToken } from '@/services/auth-session';
import { useUserStore } from '@/stores/user';
import { MessageDto } from '@/types/api/types.gen';

export type ChatWsSendPayload = {
  conversationId: number;
  messageContent: string;
};

type MessageListener = (message: MessageDto) => void;

type ChatWebSocketContextValue = {
  isConnected: boolean;
  sendMessage: (payload: ChatWsSendPayload) => boolean;
  subscribe: (listener: MessageListener) => () => void;
};

const ChatWebSocketContext = createContext<ChatWebSocketContextValue | null>(
  null,
);

export function ChatWebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useUserStore((s) => s.token);
  const userId = useUserStore((s) => s.user?.user?.id);
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);
  const isSessionHydrating = useUserStore((s) => s.isSessionHydrating);

  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const listenersRef = useRef(new Set<MessageListener>());
  const isUnmountedRef = useRef(false);

  const notifyListeners = useCallback((message: MessageDto) => {
    for (const listener of listenersRef.current) {
      listener(message);
    }
  }, []);

  const subscribe = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const sendMessage = useCallback((payload: ChatWsSendPayload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    ws.send(JSON.stringify(payload));
    return true;
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;

    const clearReconnect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    const closeSocket = () => {
      clearReconnect();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };

    if (!isSessionHydrated || isSessionHydrating || !token || !userId) {
      closeSocket();
      return () => {
        isUnmountedRef.current = true;
        closeSocket();
      };
    }

    const connect = () => {
      clearReconnect();

      const url = buildChatWsUrl(token);
      if (__DEV__) {
        console.log('[ChatWS] Connecting:', url);
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        setIsConnected(true);
        if (__DEV__) {
          console.log('[ChatWS] Connected');
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: MessageDto = JSON.parse(event.data);
          notifyListeners(message);
        } catch (error) {
          console.error('[ChatWS] Failed to parse message', error);
        }
      };

      ws.onclose = (event) => {
        wsRef.current = null;
        setIsConnected(false);

        if (isUnmountedRef.current) return;

        if (event.code === 1008) {
          if (__DEV__) {
            console.warn('[ChatWS] Invalid token (1008) — refreshing session');
          }
          void refreshAccessToken().then((result) => {
            if (isUnmountedRef.current) return;
            if (result === 'refreshed') {
              reconnectTimeoutRef.current = setTimeout(connect, 400);
            }
          });
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (event) => {
        console.error('[ChatWS] Error', event);
      };
    };

    connect();

    return () => {
      isUnmountedRef.current = true;
      closeSocket();
    };
  }, [isSessionHydrated, isSessionHydrating, token, userId, notifyListeners]);

  const value = useMemo(
    () => ({
      isConnected,
      sendMessage,
      subscribe,
    }),
    [isConnected, sendMessage, subscribe],
  );

  return (
    <ChatWebSocketContext.Provider value={value}>
      {children}
    </ChatWebSocketContext.Provider>
  );
}

export function useChatWebSocket(): ChatWebSocketContextValue {
  const ctx = useContext(ChatWebSocketContext);
  if (!ctx) {
    throw new Error('useChatWebSocket must be used within ChatWebSocketProvider');
  }
  return ctx;
}
