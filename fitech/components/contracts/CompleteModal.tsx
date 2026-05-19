import { Modal, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
  onComplete: () => void;
};

export default function CompleteModal({
  isOpen,
  onCloseModal,
  onComplete,
}: Props) {
  const { theme } = useTheme();

  const handleComplete = () => {
    onCloseModal();
    onComplete();
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
              borderBottomColor: theme.brand.primary,
              borderBottomWidth: 2,
              paddingBottom: 12,
            }}
          >
            Confirmar Finalización
          </AppText>
          <AppText
            style={{ fontSize: 17, fontWeight: 500, color: theme.icon.muted }}
          >
            ¿Estás seguro de que deseas marcar este contrato como completado?
          </AppText>
          <AppText
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: theme.text.disabled,
              marginBottom: 10,
            }}
          >
            Al confirmar, estarás declarando que el servicio ha sido ejecutado
            exitosamente y estás satisfecho con el resultado.
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
                backgroundColor: theme.brand.primary,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={handleComplete}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.text.primary,
                  fontWeight: 600,
                }}
              >
                Confirmar Finalización
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
