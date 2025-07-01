export const CREATE_USER_FORM = [
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
  { label: 'Documento', field: 'documentNumber' },
  { label: 'Usuario', field: 'username', isBase: true },
  {
    label: 'Contraseña',
    field: 'password',
    secureTextEntry: true,
    isBase: true,
  },
];
