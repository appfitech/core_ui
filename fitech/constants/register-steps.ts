export type RegisterStepConfig = {
  id: string;
  title: string;
  subtitle: string;
};

export const REGISTER_STEPS: RegisterStepConfig[] = [
  {
    id: 'account-type',
    title: 'Crear cuenta',
    subtitle: '¿Eres entrenador o usuario? Elige tu tipo de cuenta.',
  },
  {
    id: 'document',
    title: 'Identificación',
    subtitle: 'Tu documento, nombre y apellido como figuran en tu ID.',
  },
  {
    id: 'basic-info',
    title: 'Datos personales',
    subtitle: 'Correo, teléfono, género y fecha de nacimiento.',
  },
  {
    id: 'credentials',
    title: 'Acceso',
    subtitle: 'Elige un usuario y una contraseña segura.',
  },
];
