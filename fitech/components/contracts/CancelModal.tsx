import { Modal, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onCancel: () => void;
};

export default function CancelModal({ isOpen, onCloseModal, onCancel }: Props) {
  const { theme } = useTheme();

  const handleCancel = () => {
    onCloseModal();
    onCancel();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000088',
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: theme.background.app,
            padding: 20,
            borderRadius: 12,
            rowGap: 12,
          }}
        >
          <AppText
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: theme.text.primary,
              borderBottomColor: theme.status.error.text,
              borderBottomWidth: 2,
              paddingBottom: 12,
            }}
          >
            Confirmar Cancelación de Contrato
          </AppText>

          <AppText
            style={{ fontSize: 17, fontWeight: 500, color: theme.icon.muted }}
          >
            ¿Estás seguro de que deseas cancelar este contrato?
          </AppText>

          <AppText
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: theme.text.disabled,
              marginBottom: 10,
            }}
          >
            {
              'Tu solicitud será enviada al equipo de soporte para revisión en 1-3 días hábiles.\n\nLos reembolsos están sujetos a nuestros términos y condiciones.\n\nPerderás acceso inmediato a los recursos del trainer.\n\nRecibirás un email con el estado de tu solicitud.'
            }
          </AppText>

          <Tag
            label={'Esta acción no se puede deshacer'}
            backgroundColor={theme.status.warning.bg}
            textColor={theme.status.warning.text}
          />
          <View
            style={{
              flexDirection: 'row',
              columnGap: 12,
              alignSelf: 'flex-end',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: theme.background.app,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={onCloseModal}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.text.primary,
                  fontWeight: 600,
                }}
              >
                Cerrar
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme.status.error.text,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={handleCancel}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.status.error.bg,
                  fontWeight: 600,
                }}
              >
                Si, cancelar contrato
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
