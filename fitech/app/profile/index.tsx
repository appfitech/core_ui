import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AvatarSvg from '../../assets/images/avatar.svg';
import { PremiumTag } from '../components/PremiumTag';
import { useUserStore } from '../stores/user';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const person = useUserStore((s) => s.user?.user.person);
  const user = useUserStore((s) => s.user?.user);
  const userType = useUserStore((s) => s.user?.user?.type);

  const handleLogout = async () => {
    await useUserStore.getState().logout();
    router.replace('/');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          minHeight: '100%',
        },
      ]}
    >
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        {person?.profilePhotoId ? (
          <Image
            source={{
              uri: `https://appfitech.com/v1/app/file-upload/view/${person?.profilePhotoId}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarWrapper}>
            <AvatarSvg width="100%" height="100%" />
          </View>
        )}
        <Text style={styles.name}>
          {`${person?.firstName ?? ''} ${person?.lastName ?? ''}`}
        </Text>
        <Text style={styles.email}>{person?.email}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            columnGap: 5,
          }}
        >
          <Text style={styles.userType}>
            {userType === 1 ? 'Trainer' : 'Usuario'}
          </Text>
          {user?.premium && <PremiumTag />}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(100).duration(500)}
        style={styles.section}
      >
        <SectionItem
          icon="person-outline"
          label="Información Personal"
          route={'personal-info'}
        />
        <SectionItem
          icon="images-outline"
          label="Galería de Fotos"
          route={'image-gallery'}
        />
        <SectionItem
          icon="briefcase-outline"
          label="Objetivos Fitness"
          route={'goals'}
        />
      </Animated.View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SectionItem({
  icon,
  label,
  route,
}: {
  icon: string;
  label: string;
  route: string;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => route && router.push(`/${route}`)}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icon as any} size={20} color="#0F4C81" />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F4C81',
  },
  userType: {
    fontSize: 16,
    fontWeight: '700',
    color: 'green',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
  },
  itemLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#1B1F23',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#FF4D4D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
