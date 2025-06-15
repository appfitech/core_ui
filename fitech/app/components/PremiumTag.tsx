import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function PremiumTag() {
  return (
    <View style={styles.premiumTag}>
      <FontAwesome5 name="crown" size={14} color="#FFD700" />

      <Text style={styles.premiumText}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE680',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: {
    marginLeft: 4,
    color: '#A67C00',
    fontWeight: '600',
    fontSize: 12,
  },
});
