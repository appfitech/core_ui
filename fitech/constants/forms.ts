import type { KeyboardTypeOptions, TextInputProps } from 'react-native';

import type { Option } from '@/types/forms';

export type RegisterFieldInputType =
  | 'text'
  | 'dropdown'
  | 'date'
  | 'location-picker';

export type CreateUserFormField = {
  label: string;
  field: string;
  inputType?: RegisterFieldInputType;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  isBase?: boolean;
  options?: Option[];
  placeholder?: string;
  zIndex?: number;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  isOptional?: boolean;
  autoCorrect?: TextInputProps['autoCorrect'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
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
  {
    label: 'Correo electrónico',
    field: 'email',
    keyboardType: 'email-address',
    autoCorrect: false,
    autoCapitalize: 'none',
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
    /** `number-pad` avoids Android `numeric` keyboard lag / dropped digits. */
    keyboardType: 'number-pad',
    maxLength: 15,
  },
  { label: 'Nombres', field: 'firstName', autoCapitalize: 'words' },
  { label: 'Apellidos', field: 'lastName', autoCapitalize: 'words' },
];

export const REGISTER_BASIC_INFO_FIELDS: CreateUserFormField[] = [
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
  {
    label: 'Ubicación',
    field: 'residenceLocationId',
    inputType: 'location-picker',
    placeholder: 'Seleccionar distrito',
    isOptional: true,
    zIndex: 900,
  },
  {
    label: 'Lugar de entrenamiento',
    field: 'gymLocationId',
    inputType: 'location-picker',
    placeholder: 'Seleccionar distrito',
    isOptional: true,
    zIndex: 800,
  },
  {
    label: 'Acerca de ti',
    field: 'bio',
    inputType: 'text',
    multiline: true,
    numberOfLines: 5,
    placeholder: 'Cuéntanos un poco sobre ti...',
    isOptional: true,
  },
];

export const REGISTER_CREDENTIALS_FIELDS: CreateUserFormField[] = [
  {
    label: 'Usuario',
    field: 'username',
    isBase: true,
    autoCorrect: false,
    autoCapitalize: 'none',
  },
  {
    label: 'Contraseña',
    field: 'password',
    secureTextEntry: true,
    isBase: true,
  },
];

export type PersonalInfoFormField = CreateUserFormField & {
  editable?: boolean;
  showEmailVerifiedBadge?: boolean;
};

export const PERSONAL_INFO_FORM_FIELDS: PersonalInfoFormField[] = [
  {
    label: 'Documento',
    field: 'documentNumber',
    editable: false,
  },
  {
    label: 'Email',
    field: 'email',
    editable: false,
    showEmailVerifiedBadge: true,
  },
  { label: 'Nombre', field: 'firstName', placeholder: 'Nombre', autoCapitalize: 'words' },
  { label: 'Apellido', field: 'lastName', placeholder: 'Apellido', autoCapitalize: 'words' },
  {
    label: 'Fecha de Nacimiento',
    field: 'birthDate',
    inputType: 'date',
    placeholder: 'Seleccionar fecha',
  },
  {
    label: 'Teléfono',
    field: 'phoneNumber',
    keyboardType: 'phone-pad',
    placeholder: 'Teléfono',
  },
  {
    label: 'Ubicación',
    field: 'residenceLocationId',
    inputType: 'location-picker',
    placeholder: 'Seleccionar distrito',
    isOptional: true,
    zIndex: 900,
  },
  {
    label: 'Lugar de entrenamiento',
    field: 'gymLocationId',
    inputType: 'location-picker',
    placeholder: 'Seleccionar distrito',
    isOptional: true,
    zIndex: 800,
  },
  {
    label: 'Acerca de ti',
    field: 'bio',
    placeholder: 'Cuéntanos un poco sobre ti...',
    multiline: true,
    numberOfLines: 8,
    isOptional: true,
  },
];
