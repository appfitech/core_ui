import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCreateContract } from '../api/mutations/use-create-contract';
import { useCheckContractAvailability } from '../api/queries/use-check-contract-availability';
import { useGetTrainer } from '../api/queries/use-get-trainer';
import { useGetTrainerPhotos } from '../api/queries/use-get-trainer-photos';
import { useGetTrainerServices } from '../api/queries/use-get-trainer-services';
import { ContractModal } from '../components/ContractModal';
import { useUserStore } from '../stores/user';
import { TrainerService } from '../types/trainer';

export default function TrainerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = useUserStore((s) => s?.user?.user?.id);
  const router = useRouter();

  const { data: trainer } = useGetTrainer(Number(id));
  const { data: photos } = useGetTrainerPhotos(Number(id));
  const { data: services } = useGetTrainerServices(Number(id));
  const { mutateAsync: createContract } = useCreateContract();

  const { mutateAsync: checkContract } = useCheckContractAvailability();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<TrainerService | null>(
    null,
  );

  console.log('[K] clientId', clientId);

  const handleContract = async (service: TrainerService) => {
    const res = await checkContract({ clientId, serviceId: service?.id });

    console.log('[K] res', res);
    if (res?.canContract) {
      setSelectedService(service);
      setModalVisible(true);
    } else {
      Alert.alert(
        'Aviso',
        res.data?.message ||
          'Ya tienes un servicio contratado y no puedes volver a contratarlo',
      );
    }
  };

  const handleConfirmContract = async () => {
    setModalVisible(false);

    if (!selectedService) return;

    const response = await createContract({
      serviceId: selectedService.id,
      clientId,
      termsAccepted: true,
      notes: `Contrato creado desde perfil del trainer ${selectedService.trainerId}`,
    });

    console.log('[K]response', response);

    router.replace('/home');
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
      {trainer && (
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: `https://appfitech.com/v1/app/file-upload/view/${trainer.person.profilePhotoId}`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {trainer.person.firstName} {trainer.person.lastName}
          </Text>
          <Text style={styles.role}>Entrenador Personal</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-ellipses" size={16} color="#2E7D32" />
            <Text style={styles.contactText}>Contacta al entrenador</Text>
          </TouchableOpacity>
          {trainer.premium && (
            <View style={styles.premiumTag}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.premiumText}>Entrenador Certificado</Text>
            </View>
          )}
        </View>
      )}

      {services && services.length > 0 && (
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Servicios Disponibles</Text>
          {services?.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDesc}>{service.description}</Text>
              <Text style={styles.servicePrice}>
                S/ {service.totalPrice.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.hireButton}
                onPress={() => handleContract(service)}
              >
                <Ionicons name="cart" size={14} color="#fff" />
                <Text style={styles.hireText}>Contratar Servicio</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {photos && photos.length > 0 && (
        <View style={styles.gallerySection}>
          <Text style={styles.servicesTitle}>Galería</Text>
          <ScrollView horizontal>
            {photos.map((photo) => (
              <Image
                key={photo.id}
                source={{
                  uri: `https://appfitech.com/v1/app/file-upload/view/${photo.id}`,
                }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {trainer && (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Acerca de</Text>
          <Text style={styles.aboutText}>{trainer.person.bio}</Text>
        </View>
      )}

      {selectedService && (
        <ContractModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedService(null);
          }}
          onConfirm={handleConfirmContract}
          service={selectedService}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: '700', color: '#0F4C81' },
  role: { fontSize: 14, color: '#555' },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    padding: 6,
    borderRadius: 6,
  },
  contactText: { color: '#2E7D32', fontWeight: '600', marginLeft: 4 },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  premiumText: {
    marginLeft: 4,
    color: '#A67C00',
    fontWeight: '600',
    fontSize: 12,
  },
  servicesSection: { marginBottom: 24 },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  serviceName: { fontSize: 14, fontWeight: '700', color: '#0F4C81' },
  serviceDesc: { fontSize: 12, color: '#555', marginTop: 4 },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 4,
  },
  hireButton: {
    flexDirection: 'row',
    backgroundColor: '#0F4C81',
    padding: 6,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hireText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  gallerySection: { marginBottom: 24 },
  galleryImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  aboutSection: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 8,
  },
  aboutText: { fontSize: 12, color: '#555' },
});
