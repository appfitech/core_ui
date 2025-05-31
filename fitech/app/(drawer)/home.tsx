import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserStore } from '../stores/user';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#D6EDFF', '#F2F6FF']}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <Text style={styles.greeting}>
            {`Hola ${user?.user?.person.firstName}`}
          </Text>
          <Text style={styles.subtext}>Buen día</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.navBar,
          Platform.OS === 'ios' && { paddingBottom: insets.bottom },
        ]}
      >
        <Ionicons name="home" size={24} color="#0F4C81" />
        <Ionicons name="document-text-outline" size={24} color="#888" />
        <Ionicons name="chatbubble-outline" size={24} color="#888" />
        <Ionicons
          name="person-outline"
          size={24}
          color="#888"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F4C81',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#E6F4FF',
  },
});
