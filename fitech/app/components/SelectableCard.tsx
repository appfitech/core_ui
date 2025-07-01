import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export function SelectableCard({
  icon,
  title,
  description,
  selected,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        <MaterialIcons name={icon} size={30} color={theme.primary} />
      </View>
      <View style={{ flex: 1, marginRight: 20 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#0F4C81',
    backgroundColor: '#F0F8FF',
  },
  iconWrapper: {
    marginRight: 12,
    width: 30,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0F4C81',
  },
  description: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
