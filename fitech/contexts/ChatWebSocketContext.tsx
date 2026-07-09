import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

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

const RECONNECT_DELAY_MS = 1500;

export function ChatWebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useUserStore((s) => s.token);
  const syncUserId = useUserStore((s) => s.user?.user?.id);
  const isSessionHydrated = useUserStore((s) => s.isSessionHydrated);
  const isSessionHydrating = useUserStore((s) => s.isSessionHydrating);

  const [storedUserId, setStoredUserId] = useState<number | undefined>();
  const userId = syncUserId ?? storedUserId;

  const [isConnected, setIsConnected] = useState(false);

  const tokenRef = useRef<string | null>(token);
  tokenRef.current = token ?? null;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const listenersRef = useRef(new Set<MessageListener>());
  const isUnmountedRef = useRef(false);
  const intentionalCloseRef = useRef(false);
  const prevTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (syncUserId != null) {
      setStoredUserId(undefined);
      return;
    }

    let cancelled = false;
    void useUserStore
      .getState()
      .getStoredUserId()
      .then((id) => {
        if (!cancelled && id != null) {
          setStoredUserId(id);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [syncUserId]);

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

  const clearReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    clearReconnect();
    intentionalCloseRef.current = true;

    const ws = wsRef.current;
    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
      wsRef.current = null;
    }

    intentionalCloseRef.current = false;
    setIsConnected(false);
  }, [clearReconnect]);

  const scheduleReconnect = useCallback(
    (delayMs = RECONNECT_DELAY_MS) => {
      clearReconnect();
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connectRef.current();
      }, delayMs);
    },
    [clearReconnect],
  );

  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    const authToken = tokenRef.current;
    if (isUnmountedRef.current || !authToken) return;

    clearReconnect();

    const existing = wsRef.current;
    if (existing) {
      if (
        existing.readyState === WebSocket.OPEN ||
        existing.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      intentionalCloseRef.current = true;
      existing.onclose = null;
      existing.onerror = null;
      existing.close();
      wsRef.current = null;
      intentionalCloseRef.current = false;
    }

    const url = buildChatWsUrl(authToken);
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

      if (isUnmountedRef.current || intentionalCloseRef.current) return;

      if (event.code === 1008) {
        if (__DEV__) {
          console.warn('[ChatWS] Invalid token (1008) — refreshing session');
        }
        void refreshAccessToken().then((result) => {
          if (isUnmountedRef.current) return;
          if (result === 'refreshed') {
            scheduleReconnect(400);
          }
        });
        return;
      }

      scheduleReconnect();
    };

    ws.onerror = (event) => {
      console.error('[ChatWS] Error', event);
    };
  }, [clearReconnect, notifyListeners, scheduleReconnect]);

  connectRef.current = connect;

  useEffect(() => {
    isUnmountedRef.current = false;

    if (!isSessionHydrated || isSessionHydrating || !tokenRef.current || !userId) {
      closeSocket();
      return () => {
        isUnmountedRef.current = true;
        closeSocket();
      };
    }

    connect();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;

      const ws = wsRef.current;
      if (
        ws?.readyState === WebSocket.OPEN ||
        ws?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      connect();
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
      isUnmountedRef.current = true;
      closeSocket();
    };
  }, [closeSocket, connect, isSessionHydrated, isSessionHydrating, userId]);

  useEffect(() => {
    const nextToken = token ?? null;
    const prevToken = prevTokenRef.current;
    prevTokenRef.current = nextToken;

    if (
      !isSessionHydrated ||
      isSessionHydrating ||
      !userId ||
      !nextToken ||
      prevToken == null ||
      prevToken === nextToken
    ) {
      return;
    }

    const ws = wsRef.current;
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      intentionalCloseRef.current = true;
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
      wsRef.current = null;
      intentionalCloseRef.current = false;
    }

    connect();
  }, [connect, isSessionHydrated, isSessionHydrating, token, userId]);

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
