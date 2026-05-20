import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Dropdown } from '@/components/Dropdown';
import PageContainer from '@/components/PageContainer';
import { TextInput } from '@/components/TextInput';
import { textStyles } from '@/constants/styles';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSendInquiry } from '@/lib/api/mutations/useSendInquiry';
import { useUserStore } from '@/stores/user';
import { FullTheme } from '@/types/theme';

const SUPPORT_TYPES = [
  { label: 'Problema Técnico', value: 'TECHNICAL' },
  { label: 'Facturación y Pagos', value: 'BILLING' },
  { label: 'Mi Cuenta', value: 'ACCOUNT' },
  { label: 'General', value: 'GENERAL' },
];

const initialState = {
  type: '',
  subject: '',
  description: '',
};

export default function SupportScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { showAlert } = useAlert();
  const email = useUserStore((s) => s?.user?.user?.person?.email);

  const [form, setForm] = useState(initialState);

  const { mutate: submitInquiry } = useSendInquiry();

  const handleClear = () => {
    setForm(initialState);
  };

  const handleChange = (field: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.type) {
      showAlert({
        title: 'Completa los campos',
        message: 'Selecciona un tipo de consulta.',
      });
      return;
    }
    if (!form.subject.trim()) {
      showAlert({
        title: 'Completa los campos',
        message: 'El asunto es requerido.',
      });
      return;
    }
    if (form.description.trim().length < 20) {
      showAlert({
        title: 'Completa los campos',
        message: 'La descripción debe tener al menos 20 caracteres.',
      });
      return;
    }

    submitInquiry(form, {
      onSuccess: () => {
        handleClear();
        showAlert({
          title: '¡Consulta Enviada!',
          message: `Te responderemos a ${email} en un plazo de 24 horas.`,
          buttons: [{ text: 'Entendido' }],
        });
      },
      onError: () => {
        showAlert({
          title: 'Error',
          message: 'No se pudo enviar la consulta. Intenta nuevamente.',
        });
      },
    });
  };

  return (
    <PageContainer
      title="Centro de Soporte"
      subheader="¿Necesitas ayuda? Estamos aquí para asistirte"
      includeTabBarPadding={false}
      style={styles.pageStyle}
    >
      <Card style={styles.contactCard}>
        <AppText style={styles.contactTitle}>Contacto directo</AppText>
        <View style={styles.contactRow}>
          <Ionicons
            name="call-outline"
            size={20}
            color={theme.status.info.icon}
          />
          <AppText style={styles.contactText}>+51 961 529 776</AppText>
        </View>
        <View style={styles.contactRow}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={theme.status.info.icon}
          />
          <AppText style={styles.contactText}>soporte@appfitech.com</AppText>
        </View>
        <View style={styles.contactRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={theme.status.info.icon}
          />
          <AppText style={styles.contactText}>
            Joaquín Capelo 320, Miraflores, Lima, Perú
          </AppText>
        </View>
      </Card>

      <View style={styles.formCard}>
        <AppText style={styles.formCardTitle}>Enviar consulta</AppText>
        <Dropdown
          placeholder="Tipo de consulta*"
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
      </View>

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
      rowGap: 24,
    },
    contactCard: {
      backgroundColor: theme.status.info.bg,
      borderWidth: 1,
      borderColor: theme.status.info.border,
      rowGap: 12,
    },
    contactTitle: {
      ...text.sectionTitle,
      color: theme.status.info.icon,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
    },
    contactText: {
      ...text.link,
      color: theme.status.info.text,
    },
    formCard: {
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
