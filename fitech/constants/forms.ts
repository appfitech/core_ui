export const CREATE_USER_FORM = [
  { label: 'Documento', field: 'documentNumber' },
  { label: 'Nombre', field: 'firstName' },
  { label: 'Apellido', field: 'lastName' },
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
  { label: 'Usuario', field: 'username', isBase: true },
  {
    label: 'Contraseña',
    field: 'password',
    secureTextEntry: true,
    isBase: true,
  },
  { label: 'Bio', field: 'bio', type: 'text-area' },
];

export const USER_TYPES = [
  { label: 'Trainer', value: 1 },
  { label: 'Usuario', value: 2 },
];

export const DOCUMENT_TYPES = [
  { label: 'DNI', value: 'DNI' },
  { label: 'Pasaporte', value: 'PASSPORT' },
  { label: 'Carnet de Extranjeria', value: 'CE' },
];

export const GENDER_TYPES = [
  { label: 'Femenino', value: 'F' },
  { label: 'Masculino', value: 'M' },
  { label: 'Prefiero no decir', value: 'OTHER' },
];
