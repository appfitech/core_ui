import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TrainerService } from '../types/trainer';

export function ContractModal({
  visible,
  onClose,
  onConfirm,
  service,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: TrainerService;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>
              Términos y Condiciones del Servicio
            </Text>
            <Text style={styles.section}>Resumen del Servicio</Text>
            <Text style={styles.text}>Servicio: {service?.name}</Text>
            <Text style={styles.text}>
              Precio Total: S/ {service?.totalPrice.toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Modalidad: {service?.isInPerson ? 'Presencial' : 'Virtual'}
            </Text>
            <Text style={styles.section}>Términos y Condiciones Generales</Text>
            <Text style={styles.text}>
              1. Contratación del Servicio
              {'\n'}Al contratar este servicio, acepta que:
              {'\n'}El servicio será prestado por el entrenador seleccionado
              según la modalidad elegida
              {'\n'}El precio total incluye todas las sesiones especificadas en
              el paquete
              {'\n'}El pago se procesa inmediatamente al aceptar estos términos
              {'\n'}El entrenador acepta automáticamente el contrato al recibir
              el pago
              {'\n\n'}2. Proceso de Pago y Contratación
              {'\n'}Al hacer clic en "Aceptar y Continuar", se procesa el pago
              inmediatamente
              {'\n'}Una vez completado el pago, el contrato se activa
              automáticamente
              {'\n'}El entrenador recibe una notificación instantánea del nuevo
              contrato
              {'\n'}No es necesaria confirmación adicional por parte del
              entrenador
              {'\n'}El servicio queda disponible para ser programado
              inmediatamente
              {'\n\n'}3. Responsabilidades del Cliente
              {'\n'}Asistir puntualmente a las sesiones programadas
              {'\n'}Informar sobre cualquier condición médica relevante
              {'\n'}Seguir las instrucciones del entrenador durante las sesiones
              {'\n'}Comunicar cualquier inconveniente con 24 horas de
              anticipación
              {'\n\n'}4. Responsabilidades del Entrenador
              {'\n'}Brindar un servicio profesional y de calidad
              {'\n'}Respetar los horarios acordados
              {'\n'}Mantener la confidencialidad de la información del cliente
              {'\n'}Proporcionar orientación personalizada según los objetivos
              {'\n\n'}5. Cancelaciones y Reembolsos
              {'\n'}Las cancelaciones deben notificarse con 24 horas de
              anticipación
              {'\n'}Los reembolsos se procesarán según la política de la
              plataforma
              {'\n'}Las sesiones no utilizadas pueden reprogramarse dentro del
              período acordado
              {'\n\n'}6. Limitación de Responsabilidad
              {'\n'}El cliente asume la responsabilidad de su estado de salud
              durante el entrenamiento
              {'\n'}Se recomienda consultar con un médico antes de iniciar
              cualquier programa de ejercicios
              {'\n'}La plataforma actúa como intermediario entre cliente y
              entrenador
              {'\n\n'}7. Privacidad y Datos
              {'\n'}Sus datos personales serán tratados conforme a nuestra
              política de privacidad
              {'\n'}La información compartida durante las sesiones es
              confidencial
              {'\n'}Las grabaciones o fotos requieren consentimiento previo
            </Text>
            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              style={styles.checkboxRow}
            >
              <View
                style={[styles.checkbox, accepted && styles.checkboxChecked]}
              />
              <Text style={styles.checkboxText}>
                He leído y acepto los términos y condiciones del servicio
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={!accepted}
              style={[styles.confirmButton, !accepted && { opacity: 0.5 }]}
            >
              <Text style={styles.confirmText}>Contratar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    maxHeight: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 8,
  },
  section: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  text: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#0F4C81',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#0F4C81',
  },
  checkboxText: {
    fontSize: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ccc',
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#0F4C81',
    flex: 1,
    marginLeft: 4,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
