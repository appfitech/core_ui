import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { textStyles } from '@/constants/styles';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Dropdown } from '@/components/Dropdown';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useSendInquiry } from '@/lib/api/mutations/useSendInquiry';
import { FullTheme } from '@/types/theme';

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
      title="Centro de Soporte"
      subheader="¿Necesitas ayuda? Estamos aquí para asistirte"
      style={styles.pageStyle}
    >
      <Card
        style={[
          styles.contactCard,
          {
            backgroundColor: theme.background.card,
            borderWidth: 1,
            borderColor: theme.border.default,
          },
        ]}
      >
        <AppText style={styles.contactTitle}>Contacto directo</AppText>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={20} color={theme.brand.primary} />
          <AppText style={styles.contactText}>+51 (01) 615-8900</AppText>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={20} color={theme.brand.primary} />
          <AppText style={styles.contactText}>soporte@fitech.pe</AppText>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={20} color={theme.brand.primary} />
          <AppText style={styles.contactText}>
            Av. El Derby 254, Surco, Lima
          </AppText>
        </View>
      </Card>

      <Card
        style={[
          styles.formCard,
          {
            backgroundColor: theme.background.card,
            borderWidth: 1,
            borderColor: theme.border.default,
          },
        ]}
      >
        <AppText style={styles.formCardTitle}>Enviar consulta</AppText>
        <Dropdown
          value={form.type}
          options={SUPPORT_TYPES}
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
          numberOfLines={5}
          style={styles.descriptionInput}
        />
      </Card>

      <View style={styles.buttonRow}>
        <Button
          type="secondary"
          onPress={handleClear}
          label="Limpiar"
          style={styles.buttonFull}
        />
        <Button
          onPress={handleSubmit}
          label="Enviar Consulta"
          style={styles.buttonFull}
        />
      </View>
    </PageContainer>
  );
}

const getStyles = (theme: FullTheme) => {
  const text = textStyles(theme);
  return StyleSheet.create({
    pageStyle: {
      paddingHorizontal: 16,
      paddingBottom: 160,
      rowGap: 16,
    },
    contactCard: {
      rowGap: 12,
    },
    contactTitle: {
      ...text.sectionTitle,
      color: theme.text.primary,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    contactText: {
      ...text.link,
      color: theme.text.secondary,
      
    },
    formCard: {
      borderRadius: 14,
      padding: 18,
      rowGap: 14,
    },
    formCardTitle: {
      ...text.leadSemibold,
      color: theme.text.primary,
      marginBottom: 4,
    },
    descriptionInput: {
      minHeight: 100,
      maxHeight: 140,
      flex: undefined,
    },
    buttonRow: {
      rowGap: 12,
      marginTop: 8,
      width: '100%',
    },
    buttonFull: {
      width: '100%',
    },
  });
};
