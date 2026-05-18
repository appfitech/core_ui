import type { KeyboardTypeOptions } from 'react-native';

import type { Option } from '@/types/forms';

export type RegisterFieldInputType = 'text' | 'dropdown' | 'date';

export type CreateUserFormField = {
  label: string;
  field: string;
  inputType?: RegisterFieldInputType;
  type?: 'text-area';
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  isBase?: boolean;
  options?: Option[];
  placeholder?: string;
  zIndex?: number;
};

export const USER_TYPES: Option[] = [
  { label: 'Trainer', value: '1' },
  { label: 'Usuario', value: '2' },
];

export const REGISTER_ACCOUNT_TYPE_FIELDS: CreateUserFormField[] = [
  {
    label: 'Tipo de cuenta',
    field: 'type',
    inputType: 'dropdown',
    options: USER_TYPES,
    isBase: true,
    placeholder: 'Selecciona tipo de cuenta',
    zIndex: 3000,
  },
];

export const REGISTER_DOCUMENT_FIELDS: CreateUserFormField[] = [
  {
    label: 'Tipo de documento',
    field: 'documentType',
    inputType: 'dropdown',
    options: [
      { label: 'DNI', value: 'DNI' },
      { label: 'Pasaporte', value: 'PASSPORT' },
      { label: 'Carnet de Extranjeria', value: 'CE' },
    ],
    placeholder: 'Selecciona tipo de documento',
    zIndex: 2000,
  },
  {
    label: 'Número de documento',
    field: 'documentNumber',
    keyboardType: 'numeric',
  },
  { label: 'Nombres', field: 'firstName' },
  { label: 'Apellidos', field: 'lastName' },
];

export const REGISTER_BASIC_INFO_FIELDS: CreateUserFormField[] = [
  {
    label: 'Correo electrónico',
    field: 'email',
    keyboardType: 'email-address',
  },
  {
    label: 'Teléfono',
    field: 'phoneNumber',
    keyboardType: 'phone-pad',
  },
  {
    label: 'Género',
    field: 'gender',
    inputType: 'dropdown',
    options: [
      { label: 'Femenino', value: 'F' },
      { label: 'Masculino', value: 'M' },
      { label: 'Prefiero no decir', value: 'OTHER' },
    ],
    placeholder: 'Selecciona género',
    zIndex: 1000,
  },
  {
    label: 'Fecha de nacimiento',
    field: 'birthDate',
    inputType: 'date',
  },
];

export const REGISTER_CREDENTIALS_FIELDS: CreateUserFormField[] = [
  { label: 'Usuario', field: 'username', isBase: true },
  {
    label: 'Contraseña',
    field: 'password',
    secureTextEntry: true,
    isBase: true,
  },
];
