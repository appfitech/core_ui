import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSendInquiry } from '../api/mutations/useSendInquiry';
import { BackButton } from '../components/BackButton';
import { COLORS } from '../utils/colors';

const SUPPORT_TYPES = [
  { label: 'Problema Técnicos', value: 'technical' },
  { label: 'Facturación y Pagos', value: 'billing' },
  { label: 'Mi Cuenta', value: 'account' },
  { label: 'Servicios', value: 'service' },
  { label: 'Otros', value: 'other' },
];

const initialState = {
  type: '',
  subject: '',
  description: '',
};

export default function SupportScreen() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialState);

  const { mutate: submitInquiry } = useSendInquiry();

  const insets = useSafeAreaInsets();

  const handleClear = () => {
    setForm(initialState);
  };

  const handleChange = (field: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(form);
    submitInquiry(form, {
      onSuccess: () => {
        alert('success');
        handleClear();
      },
    });
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
      <View style={{ marginTop: 0, marginBottom: 50 }}>
        <BackButton />
      </View>
      <Text style={styles.title}>Centro de Soporte</Text>
      <Text style={styles.subtitle}>
        ¿Necesitas ayuda? Estamos aquí para asistirte
      </Text>

      <View style={styles.contactCard}>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          {'Contacto directo'}
        </Text>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={20} color={COLORS.iconInactive} />
          <Text style={styles.contactText}>+51 (01) 615-8900</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={20} color={COLORS.iconInactive} />
          <Text style={styles.contactText}>soporte@fitech.pe</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={COLORS.iconInactive}
          />
          <Text style={styles.contactText}>Av. El Derby 254, Surco, Lima</Text>
        </View>
      </View>

      <View style={styles.form}>
        <DropDownPicker
          open={open}
          value={form.type}
          items={SUPPORT_TYPES}
          setOpen={setOpen}
          setValue={(callback) =>
            setForm((prev) => ({
              ...prev,
              type: callback(prev.type),
            }))
          }
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={{
            backgroundColor: '#F5F7FA',
            borderColor: '#ccc',
          }}
        />
        <TextInput
          placeholder="Asunto*"
          style={styles.input}
          value={form?.subject}
          onChangeText={handleChange('subject')}
        />
        <TextInput
          placeholder="Descripción*"
          style={[styles.input, styles.textArea]}
          value={form?.description}
          onChangeText={handleChange('description')}
          multiline
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClear}>
          <Text style={styles.cancelText}>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
          <Ionicons name="send" size={16} color="#fff" />
          <Text style={styles.updateText}>Enviar Consulta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  dropdown: {
    backgroundColor: '#F5F7FA',
    borderColor: '#ccc',
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F4C81',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 15,
    color: 'white',
    fontWeight: 'medium',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    rowGap: 12,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#1B1F23',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  clearButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#0F4C81',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 20,
    rowGap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
  },
  updateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0F4C81',
    paddingVertical: 14,
    borderRadius: 10,
  },
  updateText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    paddingLeft: 10,
  },
});
