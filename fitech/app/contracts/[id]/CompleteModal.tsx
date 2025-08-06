import { Modal, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/app/components/AppText';
import { Tag } from '@/app/components/Tag';
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
              borderBottomColor: theme.green400,
              borderBottomWidth: 2,
              paddingBottom: 12,
            }}
          >
            Confirmar Finalización
          </AppText>
          <AppText
            style={{ fontSize: 17, fontWeight: 500, color: theme.dark700 }}
          >
            ¿Estás seguro de que deseas marcar este contrato como completado?
          </AppText>
          <AppText
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: theme.dark500,
              marginBottom: 10,
            }}
          >
            Al confirmar, estarás declarando que el servicio ha sido ejecutado
            exitosamente y estás satisfecho con el resultado.
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
                backgroundColor: theme.green400,
                padding: 12,
                borderRadius: 12,
              }}
              onPress={handleComplete}
            >
              <AppText
                style={{
                  fontSize: 16,
                  color: theme.green900,
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
