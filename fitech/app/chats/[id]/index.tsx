import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/app/components/AppText';
import PageContainer from '@/app/components/PageContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { FullTheme } from '@/types/theme';

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

const MOCK_THREADS: Record<string, { name: string; messages: Message[] }> = {
  '1': {
    name: 'Lucía · Trainer',
    messages: [
      {
        id: '1',
        from: 'them',
        text: '¡Hola! ¿Lista para la rutina de mañana?',
        time: '7:20 a. m.',
      },
      {
        id: '2',
        from: 'me',
        text: 'Sí, 100%. ¿Qué grupo muscular toca?',
        time: '7:22 a. m.',
      },
      {
        id: '3',
        from: 'them',
        text: 'Pierna y glúteos 💥 Te va a encantar.',
        time: '7:25 a. m.',
      },
    ],
  },
  '2': {
    name: 'Carlos · GymBro',
    messages: [
      {
        id: '1',
        from: 'them',
        text: '¿Entrenamos pecho el viernes?',
        time: '8:10 p. m.',
      },
      {
        id: '2',
        from: 'me',
        text: 'De una, mismo horario de siempre.',
        time: '8:12 p. m.',
      },
    ],
  },
  '3': {
    name: 'Ana · Nutri',
    messages: [
      {
        id: '1',
        from: 'them',
        text: 'Te mando el nuevo plan cuando termine la consulta 🙌',
        time: '5:10 p. m.',
      },
    ],
  },
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const initialThread = useMemo(
    () => MOCK_THREADS[id ?? '1'] ?? MOCK_THREADS['1'],
    [id],
  );

  const [messages, setMessages] = useState<Message[]>(initialThread.messages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMessage: Message = {
      id: `${messages.length + 1}`,
      from: 'me',
      text,
      time: 'Ahora',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <PageContainer
      header={initialThread.name}
      subheader="Organiza tus entrenos, resuelve dudas y mantén el foco en tus metas."
      style={{
        flex: 1,
        paddingBottom: 0,
        paddingHorizontal: 16,
        rowGap: 16,
      }}
      hasBottomPadding={false}
    >
      <View style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.from === 'me' ? styles.messageRowMe : styles.messageRowThem,
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
                  msg.from === 'me' ? styles.bubbleMeText : styles.bubbleText
                }
              >
                {msg.text}
              </AppText>
              <AppText style={styles.bubbleTime}>{msg.time}</AppText>
            </View>
          </View>
        ))}
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
      flexGrow: 1,
      rowGap: 8,
      paddingVertical: 8,
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
