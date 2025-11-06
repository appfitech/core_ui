import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { useOpenable } from '@/hooks/use-openable';
import { FullTheme } from '@/types/theme';

import { useSendInquiry } from '../api/mutations/useSendInquiry';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Dropdown } from '../components/Dropdown';
import PageContainer from '../components/PageContainer';
import { TextInput } from '../components/TextInput';

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
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { isOpen, setIsOpen } = useOpenable();

  const [form, setForm] = useState(initialState);

  const { mutate: submitInquiry } = useSendInquiry();

  const handleClear = () => {
    setForm(initialState);
  };

  const handleChange = (field: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    submitInquiry(form, {
      onSuccess: () => {
        alert('success');
        handleClear();
      },
    });
  };

  return (
    <PageContainer
      header={'Centro de Soporte'}
      subheader={'¿Necesitas ayuda? Estamos aquí para asistirte'}
      style={{ rowGap: 12 }}
    >
      <Card style={{ rowGap: 12 }}>
        <AppText
          style={{
            fontSize: 18,
            color: 'white',
            fontWeight: '700',
          }}
        >
          {'Contacto directo'}
        </AppText>
        <View style={styles.contactRow}>
          <Feather name="phone" size={20} color={theme.icon} />
          <AppText style={styles.contactText}>+51 (01) 615-8900</AppText>
        </View>
        <View style={styles.contactRow}>
          <Feather name="mail" size={20} color={theme.icon} />
          <AppText style={styles.contactText}>soporte@fitech.pe</AppText>
        </View>
        <View style={styles.contactRow}>
          <Feather name="map-pin" size={20} color={theme.icon} />
          <AppText style={styles.contactText}>
            Av. El Derby 254, Surco, Lima
          </AppText>
        </View>
      </Card>

      <View style={styles.form}>
        <Dropdown
          isOpen={isOpen}
          value={form.type}
          options={SUPPORT_TYPES}
          setIsOpen={setIsOpen}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              type: value,
            }))
          }
        />

        <TextInput
          placeholder="Asunto*"
          value={form?.subject}
          onChangeText={handleChange('subject')}
        />
        <TextInput
          placeholder="Descripción*"
          value={form?.description}
          onChangeText={handleChange('description')}
          multiline
          numberOfLines={7}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button type={'secondary'} onPress={handleClear} label={'Limpiar'} />
        <Button onPress={handleSubmit} label={'Enviar Consulta'} />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) =>
  StyleSheet.create({
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
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    contactText: {
      fontSize: 15,
      color: theme.dark100,
      fontWeight: 400,
    },
    form: {
      backgroundColor: '#fff',
      borderRadius: 12,
      marginTop: 10,
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
