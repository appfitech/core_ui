import { Modal, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/app/components/AppText';
import { Tag } from '@/app/components/Tag';
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
            backgroundColor: theme.background,
            padding: 20,
            borderRadius: 12,
            rowGap: 12,
          }}
        >
          <AppText
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: theme.dark900,
              borderBottomColor: theme.errorText,
              borderBottomWidth: 2,
              paddingBottom: 12,
            }}
          >
            Confirmar Cancelación de Contrato
          </AppText>

          <AppText
            style={{ fontSize: 17, fontWeight: 500, color: theme.dark700 }}
          >
            ¿Estás seguro de que deseas cancelar este contrato?
          </AppText>

          <AppText
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: theme.dark500,
              marginBottom: 10,
            }}
          >
            {
              'Tu solicitud será enviada al equipo de soporte para revisión en 1-3 días hábiles.\n\nLos reembolsos están sujetos a nuestros términos y condiciones.\n\nPerderás acceso inmediato a los recursos del trainer.\n\nRecibirás un email con el estado de tu solicitud.'
            }
          </AppText>

          <Tag
            label={'Esta acción no se puede deshacer'}
            backgroundColor={theme.warningBackground}
            textColor={theme.warningText}
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
                backgroundColor: theme.dark100,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={onCloseModal}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.dark900,
                  fontWeight: 600,
                }}
              >
                Cerrar
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme.errorText,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={handleCancel}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.errorBackground,
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
